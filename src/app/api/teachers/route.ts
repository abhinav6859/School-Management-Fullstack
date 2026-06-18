// app/api/teachers/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { authorize } from "@/lib/authorize";
import bcrypt from "bcryptjs";

// Zod validation schema for API with password
const teacherApiSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional().nullable(),
  gender: z.enum(["MALE", "FEMALE"]),
  password: z.string().min(8),
});


export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const all = searchParams.get("all") === "true"; // Add this
    
    // Build where clause for search
    const whereClause = search ? {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
      ]
    } : {};
    
    // If all=true, return all teachers without pagination
    if (all) {
      const teachers = await prisma.teacher.findMany({
        where: whereClause,
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
        orderBy: {
          firstName: "asc",
        },
      });
      return NextResponse.json(teachers);
    }
    
    // Otherwise, return paginated response
    const totalCount = await prisma.teacher.count({
      where: whereClause
    });
    
    const teachers = await prisma.teacher.findMany({
      where: whereClause,
      skip: ITEM_PER_PAGE * (page - 1),
      take: ITEM_PER_PAGE,
      include: {
        subjects: {
          select: {
            id: true,
            name: true,
          },
        },
        supervisedClasses: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: teachers,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / ITEM_PER_PAGE),
      itemsPerPage: ITEM_PER_PAGE
    });
    
  } catch (error) {
    console.error("GET teachers error:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Failed to fetch teachers" 
      },
      { status: 500 }
    );
  }
}

// app/api/teachers/route.ts (Updated POST handler)
export async function POST(req: Request) {
  try {
    // Authorize the request - check if user is ADMIN
    const user = await authorize(req, ["ADMIN"]);
    console.log("Authorized user:", user);

    const body = await req.json();

    // Validate with Zod
    const validationResult = teacherApiSchema.safeParse(body);
    
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      return NextResponse.json(
        { 
          message: firstError.message,
          errors: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Check if email already exists
    const existingEmail = await prisma.teacher.findUnique({
      where: { email: validatedData.email }
    });

    if (existingEmail) {
      return NextResponse.json(
        { message: "A teacher with this email already exists" },
        { status: 409 }
      );
    }

    // Check if username already exists
    const existingUsername = await prisma.teacher.findUnique({
      where: { username: validatedData.username }
    });

    if (existingUsername) {
      return NextResponse.json(
        { message: "This username is already taken" },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create teacher with hashed password
    const teacher = await prisma.teacher.create({
      data: {
        username: validatedData.username,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone || null,
        address: validatedData.address || null,
        bloodType: validatedData.bloodType || null,
        gender: validatedData.gender,
        password: hashedPassword,
        role: "TEACHER",
      },
    });

    // Remove password from response
    const { password, ...teacherWithoutPassword } = teacher;

    return NextResponse.json(
      { 
        success: true,
        message: "Teacher created successfully",
        teacher: teacherWithoutPassword 
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Teacher creation error:", error);
    
    // Handle authorization errors
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { 
          success: false,
          message: "You are not authorized to perform this action" 
        },
        { status: 403 }
      );
    }
    
    // Handle Prisma unique constraint violations
    if (error.code === 'P2002') {
      return NextResponse.json(
        { 
          success: false,
          message: "A teacher with this username or email already exists" 
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        message: error.message || "Something went wrong" 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Teacher ID is required",
        },
        { status: 400 }
      );
    }

    await prisma.teacher.delete({
      where: {
        id: id, 
      },
    });

    return NextResponse.json({
      success: true,
      message: "Teacher deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Delete failed",
      },
      { status: 500 }
    );
  }
}