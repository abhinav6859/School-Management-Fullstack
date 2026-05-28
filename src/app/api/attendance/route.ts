import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const attendance =
      await prisma.attendance.findMany({
        include: {
          student: true,
          lesson: true,
        },

        orderBy: {
          id: "desc",
        },
      });

    return NextResponse.json(
      attendance
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          "Failed to fetch attendance",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const attendance =
      await prisma.attendance.create({
        data: {
          date: new Date(body.date),

          present: body.present === true,

          student: {
            connect: {
              id: body.studentId,
            },
          },

          lesson: {
            connect: {
              id: Number(body.lessonId),
            },
          },
        },
      });

    return NextResponse.json(
      attendance
    );
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