
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { authorize } from "@/lib/authorize";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Zod validation schema for parent with password
const parentApiSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().optional().nullable(),
  password: z.string().min(8),
});

export async function GET() {
  try {
    const parents = await prisma.parent.findMany({
      include: {
        students: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(parents);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch parents" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Authorize the request - check if user is ADMIN
    await authorize(req, ["ADMIN"]);
    
    const body = await req.json();

    // Validate with Zod
    const validationResult = parentApiSchema.safeParse(body);
    
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return NextResponse.json(
        { 
          message: firstError.message,
          errors: validationResult.error.issues 
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Check if email already exists
    const existingEmail = await prisma.parent.findUnique({
      where: { email: validatedData.email }
    });

    if (existingEmail) {
      return NextResponse.json(
        { message: "A parent with this email already exists" },
        { status: 409 }
      );
    }

    // Check if username already exists
    const existingUsername = await prisma.parent.findUnique({
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

    // Create parent with hashed password
    const parent = await prisma.parent.create({
      data: {
        username: validatedData.username,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        address: validatedData.address || null,
        password: hashedPassword,
      },
    });

    // Remove password from response
    const { password, ...parentWithoutPassword } = parent;

    return NextResponse.json(
      { 
        success: true,
        message: "Parent created successfully",
        parent: parentWithoutPassword 
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.log("Parent creation error:", error);
    
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
          message: "A parent with this username or email already exists" 
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