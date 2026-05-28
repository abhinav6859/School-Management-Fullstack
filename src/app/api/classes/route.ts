import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const classes = await prisma.class.findMany({
      include: {
        grade: true,
        supervisor: true,
        students: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(classes);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch classes" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const newClass = await prisma.class.create({
      data: {
        name: body.name,
        capacity: Number(body.capacity),

        grade: {
          connect: {
            id: Number(body.gradeId),
          },
        },

        supervisor: body.supervisorId
          ? {
              connect: {
                id: body.supervisorId,
              },
            }
          : undefined,
      },
    });

    return NextResponse.json(newClass);
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      {
        message: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}