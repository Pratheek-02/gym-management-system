"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import type { PaymentMethod } from "@/generated/prisma/client";

export async function getPayments(limit = 50) {
  return prisma.payment.findMany({
    include: {
      client: true,
      feeInvoice: true,
    },
    orderBy: { paidAt: "desc" },
    take: limit,
  });
}

export async function recordPayment(data: {
  clientId: string;
  feeInvoiceId?: string;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  notes?: string;
}) {
  const payment = await prisma.payment.create({
    data: {
      clientId: data.clientId,
      feeInvoiceId: data.feeInvoiceId || null,
      amount: data.amount,
      method: data.method,
      reference: data.reference || null,
      notes: data.notes || null,
    },
  });

  if (data.feeInvoiceId) {
    const invoice = await prisma.feeInvoice.findUniqueOrThrow({
      where: { id: data.feeInvoiceId },
    });
    const newPaid = invoice.amountPaid + data.amount;
    let status: "PAID" | "PARTIAL" | "PENDING" = "PARTIAL";
    if (newPaid >= invoice.amount) status = "PAID";
    else if (newPaid <= 0) status = "PENDING";

    await prisma.feeInvoice.update({
      where: { id: data.feeInvoiceId },
      data: { amountPaid: newPaid, status },
    });
  }

  revalidatePath("/payments");
  revalidatePath("/fees");
  revalidatePath("/");
  revalidatePath(`/clients/${data.clientId}`);
  return payment;
}
