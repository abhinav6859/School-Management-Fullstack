import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const announcements =
      await prisma.announcement.findMany({
        include: {
          class: true,
        },

        orderBy: {
          id: "desc",
        },
      });

    return NextResponse.json(
      announcements
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          "Failed to fetch announcements",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const announcement =
      await prisma.announcement.create({
        data: {
          title: body.title,

          description:
            body.description,

          date: new Date(body.date),

          class: body.classId
            ? {
                connect: {
                  id: Number(
                    body.classId
                  ),
                },
              }
            : undefined,
        },
      });

    return NextResponse.json(
      announcement
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