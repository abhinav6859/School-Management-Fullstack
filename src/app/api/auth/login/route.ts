import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma"; // Adjust import path as needed

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // First try to find user in Admin table
   let user: any= await prisma.admin.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        
        // Add any other fields you need
      },
    });

    let userType = "ADMIN";

    // If not found in Admin, try Teacher table
    if (!user) {
      user = await prisma.teacher.findUnique({
        where: { username },
        select: {
          id: true,
          username: true,
          email: true,
          password: true,
          
          firstName: true,
          lastName: true,
          // Add any other fields you need
        },
      });
      userType = "TEACHER";
    }

    // If still not found, try Student table (if you have one)
    if (!user) {
      user = await prisma.student.findUnique({
        where: { username },
        select: {
          id: true,
          username: true,
          email: true,
          password: true,
          
          firstName: true,
          lastName: true,
        },
      });
      userType = "STUDENT";
    }

    // If user not found in any table
    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Generate JWT token
  const token = jwt.sign(
  {
    id: user.id,
    username: user.username,
    email: user.email,
    role: userType,
    userType,
  },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      token,
      user: userWithoutPassword,
      role: userType,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}