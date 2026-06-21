// app/api/payments/create-order/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";

export async function POST(req: Request) {
  const { studentFeeId } = await req.json();

  const fee = await prisma.studentFee.findUnique({
    where: { id: studentFeeId },
  });

  if (!fee) {
    return NextResponse.json(
      { error: "Fee not found" },
      { status: 404 }
    );
  }

  const order = await razorpay.orders.create({
    amount: Math.round(fee.amount * 100),
    currency: "INR",
    receipt: fee.id,
  });

  const payment = await prisma.payment.create({
    data: {
      studentFeeId: fee.id,
      amount: fee.amount,
      razorpayOrderId: order.id,
    },
  });

  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    paymentId: payment.id,
  });
}