import { authorize } from "@/lib/authorize";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const lessons = await prisma.lesson.findMany({
      include: {
        subject: true,
        class: true,
        teacher: true,
        exams: true,
        assignments: true,
      },

      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(lessons);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch lessons" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    authorize(req, ["ADMIN", "TEACHER"]);
    const body = await req.json();

    const lesson = await prisma.lesson.create({
      data: {
        name: body.name,

        day: body.day,

        startTime: new Date(body.startTime),

        endTime: new Date(body.endTime),

        subject: {
          connect: {
            id: Number(body.subjectId),
          },
        },

        class: {
          connect: {
            id: Number(body.classId),
          },
        },

        teacher: {
          connect: {
            id: body.teacherId,
          },
        },
      },
    });

    return NextResponse.json(lesson);
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