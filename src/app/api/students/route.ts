
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authorize } from "@/lib/authorize";

const StudentSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters"),

  img: z
    .string()
    .url("Image must be a valid URL")
    .optional()
    .or(z.literal("")),

  firstName: z
    .string()
    .min(2, "First name is required"),

  lastName: z
    .string()
    .min(2, "Last name is required"),

  email: z
    .string()
    .email("Invalid email")
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .min(10, "Phone number is too short")
    .max(15, "Phone number is too long")
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .optional(),

  bloodType: z
    .string()
    .min(1, "Blood type is required"),

  sex: z.enum(["MALE", "FEMALE"]),

  birthday: z.coerce.date(),

  parentId: z
    .string()
    .min(1, "Parent is required"),

  gradeId: z.coerce
    .number()
    .int()
    .positive("Grade is required"),

  classId: z.coerce
    .number()
    .int()
    .positive("Class is required"),
});

export type StudentInput = z.infer<typeof StudentSchema>;

const StudentUpdateSchema = z.object({
  id: z.string().cuid("Invalid student id"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .optional(),
  img: z
    .string()
    .url("Image must be a valid URL")
    .optional()
    .or(z.literal("")),
  firstName: z
    .string()
    .min(2, "First name is required")
    .optional(),
  lastName: z
    .string()
    .min(2, "Last name is required")
    .optional(),
  email: z
    .string()
    .email("Invalid email")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .min(10, "Phone number is too short")
    .max(15, "Phone number is too long")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .optional(),
  bloodType: z
    .string()
    .min(1, "Blood type is required")
    .optional(),
  sex: z.enum(["MALE", "FEMALE"]).optional(),
  birthday: z.coerce.date().optional(),
  parentId: z
    .string()
    .min(1, "Parent is required")
    .optional(),
  gradeId: z.coerce
    .number()
    .int()
    .positive("Grade is required")
    .optional(),
  classId: z.coerce
    .number()
    .int()
    .positive("Class is required")
    .optional(),
});

const StudentDeleteSchema = z.object({
  id: z.string().cuid("Invalid student id"),
});

export async function GET(req: Request) {
  try {
    console.log("GET /api/students called");

    // TEMPORARILY DISABLE AUTH
    // authorize(req, ["ADMIN"]);

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

    console.log("Students found:", students.length);

    return NextResponse.json(students);
  } catch (error) {
    console.error("FULL ERROR:");
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedFields = StudentSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validatedFields.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validatedFields.data;

    const student = await prisma.student.create({
      data: {
        username: data.username,
        img: data.img || null,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,

        parent: {
          connect: {
            id: data.parentId,
          },
        },

        class: {
          connect: {
            id: data.classId,
          },
        },

        grade: {
          connect: {
            id: data.gradeId,
          },
        },
      },

      include: {
        parent: true,
        class: true,
        grade: true,
      },
    });

    // Dispatch event for real-time updates
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent("studentCreated", { detail: student }));
    }

    return NextResponse.json({
      success: true,
      data: student,
    });
  } catch (error: any) {
    console.error("POST Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const validatedFields = StudentUpdateSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validatedFields.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { id, ...updateData } = validatedFields.data;

    // Prepare update data with proper null handling
    const dataToUpdate: any = {};

    if (updateData.username !== undefined) dataToUpdate.username = updateData.username;
    if (updateData.img !== undefined) dataToUpdate.img = updateData.img || null;
    if (updateData.firstName !== undefined) dataToUpdate.firstName = updateData.firstName;
    if (updateData.lastName !== undefined) dataToUpdate.lastName = updateData.lastName;
    if (updateData.email !== undefined) dataToUpdate.email = updateData.email || null;
    if (updateData.phone !== undefined) dataToUpdate.phone = updateData.phone || null;
    if (updateData.address !== undefined) dataToUpdate.address = updateData.address || null;
    if (updateData.bloodType !== undefined) dataToUpdate.bloodType = updateData.bloodType;
    if (updateData.sex !== undefined) dataToUpdate.sex = updateData.sex;
    if (updateData.birthday !== undefined) dataToUpdate.birthday = updateData.birthday;

    // Handle relations if provided
    if (updateData.parentId) {
      dataToUpdate.parent = { connect: { id: updateData.parentId } };
    }
    if (updateData.classId) {
      dataToUpdate.class = { connect: { id: updateData.classId } };
    }
    if (updateData.gradeId) {
      dataToUpdate.grade = { connect: { id: updateData.gradeId } };
    }

    const student = await prisma.student.update({
      where: { id },
      data: dataToUpdate,
      include: {
        parent: true,
        class: true,
        grade: true,
      },
    });

    // Dispatch event for real-time updates
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent("studentUpdated", { detail: student }));
    }

    return NextResponse.json({
      success: true,
      data: student,
    });
  } catch (error: any) {
    console.error("PUT Error:", error);

    // Handle specific Prisma errors
    if (error.code === 'P2025') {
      return NextResponse.json(
        {
          success: false,
          message: "Student not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  // PATCH works the same as PUT for partial updates
  return PUT(req);
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const validation = StudentDeleteSchema.safeParse({
      id: searchParams.get("id"),
    });

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { id } = validation.data;

    const student = await prisma.student.delete({
      where: { id },
    });

    // Dispatch event for real-time updates
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent("studentDeleted", { detail: student }));
    }

    return NextResponse.json({
      success: true,
      data: student,
    });
  } catch (error: any) {
    console.error("DELETE Error:", error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        {
          success: false,
          message: "Student not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}