// app/api/dashboard/counts/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/authorize";

export async function GET(req: Request) {
  try {
    await authorize(req, ["ADMIN", "TEACHER", "STUDENT", "PARENT"]);
    
    // 🚀 Get all counts in parallel using count()
    const [students, teachers, parents, admins] = await Promise.all([
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.parent.count(),
      prisma.admin.count(),
    ]);

    const currentYear = new Date().getFullYear();
    const yearLabel = `${currentYear}/${currentYear + 1}`;

    return NextResponse.json({
      student: { count: students, year: yearLabel },
      teacher: { count: teachers, year: yearLabel },
      parent: { count: parents, year: yearLabel },
      admin: { count: admins, year: yearLabel },
    });
  } catch (error: any) {
    console.error("Error fetching counts:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch counts" },
      { status: 500 }
    );
  }
}