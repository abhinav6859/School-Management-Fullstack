import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const results =
      await prisma.result.findMany({
        include: {
          student: true,
          exam: true,
          assignment: true,
        },

        orderBy: {
          id: "desc",
        },
      });

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          "Failed to fetch results",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result =
      await prisma.result.create({
        data: {
          score: Number(body.score),

          student: {
            connect: {
              id: body.studentId,
            },
          },

          exam: body.examId
            ? {
                connect: {
                  id: Number(
                    body.examId
                  ),
                },
              }
            : undefined,

          assignment:
            body.assignmentId
              ? {
                  connect: {
                    id: Number(
                      body.assignmentId
                    ),
                  },
                }
              : undefined,
        },
      });

    return NextResponse.json(
      result
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