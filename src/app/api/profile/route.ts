// app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { authorize } from "@/lib/authorize";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const profileUpdateSchema = z.object({
  bio: z.string().optional().nullable(),
  socialLinks: z.object({
    linkedin: z.string().url().optional().nullable(),
    twitter: z.string().url().optional().nullable(),
    github: z.string().url().optional().nullable(),
    website: z.string().url().optional().nullable(),
  }).optional(),
});

// 🚀 SPEED OPTIMIZATION: Cache profile data for 5 minutes
const profileCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCachedProfile(key: string) {
  const cached = profileCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCachedProfile(key: string, data: any) {
  profileCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

function clearProfileCache(userId: string) {
  profileCache.delete(userId);
  // Also clear "all" cache
  profileCache.delete("all");
}

// 🚀 SPEED OPTIMIZATION: Select only needed fields
const adminSelect = {
  id: true,
  username: true,
  email: true,
  role: true,
  createdAt: true,
};

const teacherSelect = {
  id: true,
  username: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  address: true,
  bio: true,
  socialLinks: true,
  gender: true,
  bloodType: true,
  birthday: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

const studentSelect = {
  id: true,
  username: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  address: true,
  bio: true,
  socialLinks: true,
  bloodType: true,
  sex: true,
  birthday: true,
  createdAt: true,
  updatedAt: true,
  grade: { 
    select: { 
      level: true 
    } 
  },
  class: { 
    select: { 
      id: true, 
      name: true 
    } 
  },
  parent: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      phone: true,
      email: true,
    },
  },
};

const parentSelect = {
  id: true,
  username: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  address: true,
  bio: true,
  socialLinks: true,
  createdAt: true,
  updatedAt: true,
  students: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      class: { 
        select: { 
          name: true 
        } 
      },
    },
  },
};

export async function GET(request: NextRequest) {
  try {
    const user = await authorize(request, ["ADMIN", "TEACHER", "STUDENT", "PARENT"]);
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    // 🚀 SPEED OPTIMIZATION: Check cache first
    const cacheKey = userId || user.id;
    const cachedProfile = getCachedProfile(cacheKey);
    if (cachedProfile) {
      return NextResponse.json(cachedProfile, {
        headers: {
          'Cache-Control': 'private, max-age=300', // 5 minutes
        },
      });
    }
    
    // If admin is viewing another user's profile
    if (user.role === "ADMIN" && userId) {
      let profile = null;
      
      // Check Admin first
      profile = await prisma.admin.findUnique({
        where: { id: userId },
        select: adminSelect,
      });
      if (profile) {
        const result = { 
          success: true, 
          ...profile, 
          isAdminView: true,
          firstName: profile.username,
          lastName: "",
          bio: null,
          socialLinks: null
        };
        setCachedProfile(cacheKey, result);
        return NextResponse.json(result, {
          headers: {
            'Cache-Control': 'private, max-age=300',
          },
        });
      }
      
      // Check Teacher
      profile = await prisma.teacher.findUnique({
        where: { id: userId },
        select: teacherSelect,
      });
      if (profile) {
        const result = { success: true, ...profile, isAdminView: true };
        setCachedProfile(cacheKey, result);
        return NextResponse.json(result, {
          headers: {
            'Cache-Control': 'private, max-age=300',
          },
        });
      }
      
      // Check Student
      profile = await prisma.student.findUnique({
        where: { id: userId },
        select: studentSelect,
      });
      if (profile) {
        const result = { success: true, ...profile, role: "STUDENT", isAdminView: true };
        setCachedProfile(cacheKey, result);
        return NextResponse.json(result, {
          headers: {
            'Cache-Control': 'private, max-age=300',
          },
        });
      }
      
      // Check Parent
      profile = await prisma.parent.findUnique({
        where: { id: userId },
        select: parentSelect,
      });
      if (profile) {
        const result = { success: true, ...profile, role: "PARENT", isAdminView: true };
        setCachedProfile(cacheKey, result);
        return NextResponse.json(result, {
          headers: {
            'Cache-Control': 'private, max-age=300',
          },
        });
      }
      
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    
    // Get current user's profile
    let profile = null;
    
    if (user.role === "ADMIN") {
      profile = await prisma.admin.findUnique({
        where: { id: user.id },
        select: adminSelect,
      });
      if (profile) {
        const result = {
          success: true,
          ...profile,
          firstName: profile.username,
          lastName: "",
          bio: "",
          socialLinks: null,
          isAdminView: false,
        };
        setCachedProfile(cacheKey, result);
        return NextResponse.json(result, {
          headers: {
            'Cache-Control': 'private, max-age=300',
          },
        });
      }
    } else if (user.role === "TEACHER") {
      profile = await prisma.teacher.findUnique({
        where: { id: user.id },
        select: teacherSelect,
      });
    } else if (user.role === "STUDENT") {
      profile = await prisma.student.findUnique({
        where: { id: user.id },
        select: studentSelect,
      });
      if (profile) {
        profile = { ...profile, role: "STUDENT" };
      }
    } else if (user.role === "PARENT") {
      profile = await prisma.parent.findUnique({
        where: { id: user.id },
        select: parentSelect,
      });
      if (profile) {
        profile = { ...profile, role: "PARENT" };
      }
    }

    if (!profile) {
      return NextResponse.json(
        { success: false, message: "Profile not found" },
        { status: 404 }
      );
    }

    const result = { 
      success: true, 
      ...profile, 
      isAdminView: false 
    };
    
    setCachedProfile(cacheKey, result);
    
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'private, max-age=300', // 5 minutes
      },
    });
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch profile" },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await authorize(request, ["TEACHER", "STUDENT", "PARENT"]);
    
    // Admin cannot update profile (they don't have bio/socialLinks)
    if (user.role === "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Admin cannot update profile" },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { bio, socialLinks } = body;

    const updateData: any = {};
    if (bio !== undefined) updateData.bio = bio;
    if (socialLinks !== undefined) {
      // Remove empty social links
      const cleanedLinks: any = {};
      Object.keys(socialLinks).forEach(key => {
        if (socialLinks[key] && socialLinks[key].trim()) {
          cleanedLinks[key] = socialLinks[key];
        }
      });
      updateData.socialLinks = Object.keys(cleanedLinks).length > 0 ? cleanedLinks : null;
    }

    // 🚀 SPEED OPTIMIZATION: Update only what changed
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: "No data to update" },
        { status: 400 }
      );
    }

    // Update profile based on role
    const modelMap: Record<string, any> = {
      TEACHER: prisma.teacher,
      STUDENT: prisma.student,
      PARENT: prisma.parent,
    };

    const model = modelMap[user.role];
    if (!model) {
      return NextResponse.json(
        { success: false, message: "Invalid user role" },
        { status: 400 }
      );
    }

    const updatedProfile = await model.update({
      where: { id: user.id },
      data: updateData,
    });

    // 🚀 SPEED OPTIMIZATION: Clear cache after update
    clearProfileCache(user.id);

    return NextResponse.json({
      success: true,
      ...updatedProfile,
      role: user.role,
    });
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}