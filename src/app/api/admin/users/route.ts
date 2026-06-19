// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { authorize } from "@/lib/authorize";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Only admin can access
    const user = await authorize(request, ["ADMIN"]);
    
    // Get all users from all models
    const [admins, teachers, students, parents] = await Promise.all([
      prisma.admin.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.teacher.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.student.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
        },
      }),
      prisma.parent.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
        },
      }),
    ]);

    // Add role to student and parent
    const studentsWithRole = students.map(s => ({ ...s, role: "STUDENT" }));
    const parentsWithRole = parents.map(p => ({ ...p, role: "PARENT" }));

    const allUsers = [...admins, ...teachers, ...studentsWithRole, ...parentsWithRole];
    
    // Sort by createdAt descending
    allUsers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(allUsers);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch users" },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}