import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        teachers: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        lessons: {
          select: {
            id: true,
          },
        },
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
    
    // Check for unique subject name
    const existingSubject = await prisma.subject.findUnique({
      where: { name: body.name },
    });

    if (existingSubject) {
      return NextResponse.json(
        { message: "Subject name already exists" },
        { status: 400 }
      );
    }

    const subject = await prisma.subject.create({
      data: {
        name: body.name,
        teachers: {
          connect: body.teacherIds?.map((id: string) => ({
            id,
          })) || [],
        },
      },
      include: {
        teachers: true,
        lessons: true,
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

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, teacherIds } = body;

    // Check for unique subject name (excluding current subject)
    const existingSubject = await prisma.subject.findFirst({
      where: {
        name: name,
        NOT: {
          id: parseInt(id),
        },
      },
    });

    if (existingSubject) {
      return NextResponse.json(
        { message: "Subject name already exists" },
        { status: 400 }
      );
    }

    const subject = await prisma.subject.update({
      where: { id: parseInt(id) },
      data: {
        name: name,
        teachers: {
          set: teacherIds.map((id: string) => ({ id })),
        },
      },
      include: {
        teachers: true,
        lessons: true,
      },
    });

    return NextResponse.json(subject);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      {
        message: error.message || "Failed to update subject",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Subject ID is required" },
        { status: 400 }
      );
    }

    // Check if subject has any teachers
    const subject = await prisma.subject.findUnique({
      where: { id: parseInt(id) },
      include: {
        teachers: true,
        lessons: true,
      },
    });

    if (!subject) {
      return NextResponse.json(
        { message: "Subject not found" },
        { status: 404 }
      );
    }

    if (subject.teachers.length > 0) {
      return NextResponse.json(
        { 
          message: "Teacher present in this subject so remove first",
          hasTeachers: true 
        },
        { status: 400 }
      );
    }

    // Delete the subject
    await prisma.subject.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ 
      message: "Subject deleted successfully",
      success: true 
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      {
        message: error.message || "Failed to delete subject",
      },
      { status: 500 }
    );
  }
}