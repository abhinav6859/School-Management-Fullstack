// app/api/students/stats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/authorize";

export async function GET(req: Request) {
  try {
    // Authorize the request
    const user = await authorize(req, ["ADMIN", "TEACHER", "STUDENT", "PARENT"]);
    
    // Get total students
    const total = await prisma.student.count();
    
    // Get male students
    const boys = await prisma.student.count({
      where: { sex: "MALE" },
    });
    
    // Get female students
    const girls = await prisma.student.count({
      where: { sex: "FEMALE" },
    });
    
    // Calculate percentages
    const boysPercentage = total > 0 ? Math.round((boys / total) * 100) : 0;
    const girlsPercentage = total > 0 ? Math.round((girls / total) * 100) : 0;
    
    return NextResponse.json({
      total,
      boys,
      girls,
      boysPercentage,
      girlsPercentage,
    });
  } catch (error: any) {
    console.error("Error fetching student stats:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch student statistics" },
      { status: 500 }
    );
  }
}