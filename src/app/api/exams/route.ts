import { authorize } from "@/lib/authorize";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const exams = await prisma.exam.findMany({
      include: {
        lesson: true,
        teacher: true,
        results: true,
      },

      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(exams);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch exams" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    authorize(req, ["ADMIN", "TEACHER"]);
    const body = await req.json();

    const exam = await prisma.exam.create({
      data: {
        title: body.title,

        startTime: new Date(
          body.startTime
        ),

        endTime: new Date(
          body.endTime
        ),

        lesson: {
          connect: {
            id: Number(body.lessonId),
          },
        },

        teacher: {
          connect: {
            id: body.teacherId,
          },
        },
      },
    });

    return NextResponse.json(exam);
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}