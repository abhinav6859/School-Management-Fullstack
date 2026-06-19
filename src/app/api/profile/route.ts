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

export async function GET(request: NextRequest) {
  try {
    const user = await authorize(request, ["ADMIN", "TEACHER", "STUDENT", "PARENT"]);
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    // If admin is viewing another user's profile
    if (user.role === "ADMIN" && userId) {
      let profile = null;
      
      // Check Admin first
      profile = await prisma.admin.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });
      if (profile) {
        // Admin doesn't have bio/socialLinks, so just return basic info
        return NextResponse.json({ 
          success: true, 
          ...profile, 
          isAdminView: true,
          firstName: profile.username,
          lastName: "",
          bio: null,
          socialLinks: null
        });
      }
      
      // Check Teacher
      profile = await prisma.teacher.findUnique({
        where: { id: userId },
        select: {
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
        },
      });
      if (profile) {
        return NextResponse.json({ success: true, ...profile, isAdminView: true });
      }
      
      // Check Student
      profile = await prisma.student.findUnique({
        where: { id: userId },
        select: {
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
          grade: { select: { level: true } },
          class: { select: { id: true, name: true } },
          parent: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
              email: true,
            },
          },
        },
      });
      if (profile) {
        return NextResponse.json({ success: true, ...profile, role: "STUDENT", isAdminView: true });
      }
      
      // Check Parent
      profile = await prisma.parent.findUnique({
        where: { id: userId },
        select: {
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
              class: { select: { name: true } },
            },
          },
        },
      });
      if (profile) {
        return NextResponse.json({ success: true, ...profile, role: "PARENT", isAdminView: true });
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
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });
      // Admin doesn't have bio/socialLinks
      if (profile) {
        return NextResponse.json({
          success: true,
          ...profile,
          firstName: profile.username,
          lastName: "",
          bio: "",
          socialLinks: null,
          isAdminView: false,
        });
      }
    } else if (user.role === "TEACHER") {
      profile = await prisma.teacher.findUnique({
        where: { id: user.id },
        select: {
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
        },
      });
    } else if (user.role === "STUDENT") {
      profile = await prisma.student.findUnique({
        where: { id: user.id },
        select: {
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
          grade: { select: { level: true } },
          class: { select: { id: true, name: true } },
          parent: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
              email: true,
            },
          },
        },
      });
      if (profile) {
        profile = { ...profile, role: "STUDENT" };
      }
    } else if (user.role === "PARENT") {
      profile = await prisma.parent.findUnique({
        where: { id: user.id },
        select: {
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
              class: { select: { name: true } },
            },
          },
        },
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

    return NextResponse.json({ 
      success: true, 
      ...profile, 
      isAdminView: false 
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