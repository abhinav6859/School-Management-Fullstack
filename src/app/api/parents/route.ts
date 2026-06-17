import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { authorize } from "@/lib/authorize";

export async function GET() {
  try {
    const parents = await prisma.parent.findMany({
      include: {
        students: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(parents);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch parents" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    authorize(req, ["ADMIN"]);
    const body = await req.json();

    const parent = await prisma.parent.create({
      data: {
        username: body.username,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        address: body.address,
      },
    });

    return NextResponse.json(parent);
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