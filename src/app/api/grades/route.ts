import { authorize } from "@/lib/authorize";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const grades = await prisma.grade.findMany({
      select: {
        id: true,
        level: true,
        _count: {
          select: {
            classes: true,
            students: true,
          },
        },
      },
      orderBy: {
        level: "asc",
      },
    });

    return NextResponse.json(grades);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch grades" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    authorize(req, ["ADMIN"]);

    const body = await req.json();

    const grade = await prisma.grade.create({
      data: {
        level: Number(body.level),
      },
    });

    return NextResponse.json(grade);
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}