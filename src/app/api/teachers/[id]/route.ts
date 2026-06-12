// app/api/teachers/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        subjects: {
          select: {
            id: true,
            name: true,
          },
        },
        supervisedClasses: {
          include: {
            students: {
              select: {
                id: true,
              },
            },
          },
        },
        // If you have a lessons or schedule relation, include it
        // lessons: true,
      },
    });

    if (!teacher) {
      return NextResponse.json(
        { success: false, message: "Teacher not found" },
        { status: 404 }
      );
    }

    // Calculate derived stats
    const totalStudents = teacher.supervisedClasses?.reduce(
      (sum, classItem) => sum + (classItem.students?.length || 0),
      0
    ) || 0;

    const totalClasses = teacher.supervisedClasses?.length || 0;

    // You can add experience calculation if you have a joinDate field
    // const experience = teacher.joinDate ? new Date().getFullYear() - new Date(teacher.joinDate).getFullYear() : 0;

    return NextResponse.json({
      success: true,
      data: {
        ...teacher,
        totalStudents,
        totalClasses,
        // experience, // uncomment when you have joinDate
      },
    });
  } catch (error) {
    console.error("Error fetching teacher:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch teacher details" },
      { status: 500 }
    );
  }
}