import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: {
        parent: true,
        class: true,
        grade: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const student = await prisma.student.create({
      data: {
        username: body.username,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        address: body.address,
        bloodType: body.bloodType,
        sex: body.sex,
        birthday: new Date(body.birthday),

        parent: {
          connect: {
            id: body.parentId,
          },
        },

        class: {
          connect: {
            id: Number(body.classId),
          },
        },

        grade: {
          connect: {
            id: Number(body.gradeId),
          },
        },
      },
    });

    return NextResponse.json(student);
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