import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { authorize } from "@/lib/authorize";

export async function GET() {
  try {
    const assignments =
      await prisma.assignment.findMany({
        include: {
          lesson: true,
          teacher: true,
          results: true,
        },

        orderBy: {
          id: "desc",
        },
      });

    return NextResponse.json(assignments);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          "Failed to fetch assignments",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
      authorize(req, ["ADMIN", "TEACHER"]);
    const body = await req.json();

    const assignment =
      await prisma.assignment.create({
        data: {
          title: body.title,

          startDate: new Date(
            body.startDate
          ),

          dueDate: new Date(
            body.dueDate
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

    return NextResponse.json(
      assignment
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