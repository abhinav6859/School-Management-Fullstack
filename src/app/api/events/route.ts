import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { authorize } from "@/lib/authorize";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        class: true,
      },

      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch events",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    authorize(req, ["ADMIN", "TEACHER"]);
    const body = await req.json();

    const event = await prisma.event.create({
      data: {
        title: body.title,

        description: body.description,

        startTime: new Date(body.startTime),

        endTime: new Date(body.endTime),

        class: body.classId
          ? {
              connect: {
                id: Number(body.classId),
              },
            }
          : undefined,
      },
    });

    return NextResponse.json(event);
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