import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        teachers: true,
        lessons: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(subjects);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const subject = await prisma.subject.create({
      data: {
        name: body.name,

        teachers: {
          connect: body.teacherIds.map(
            (id: string) => ({
              id,
            })
          ),
        },
      },
    });

    return NextResponse.json(subject);
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