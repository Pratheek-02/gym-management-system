"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { startOfMonth, endOfMonth } from "date-fns";
import { getGymSettings } from "@/lib/actions/settings";

export async function getInvoices(filter?: "pending" | "overdue" | "all") {
  const invoices = await prisma.feeInvoice.findMany({
    include: { client: { include: { membershipPlan: true } } },
    orderBy: { dueDate: "asc" },
  });

  const now = new Date();
  if (filter === "pending") {
    return invoices.filter((i) => i.status === "PENDING" || i.status === "PARTIAL");
  }
  if (filter === "overdue") {
    return invoices.filter(
      (i) =>
        i.status === "OVERDUE" ||
        (i.status === "PENDING" && new Date(i.dueDate) < now)
    );
  }
  return invoices;
}

export async function createMonthlyInvoice(clientId: string) {
  const [client, settings] = await Promise.all([
    prisma.client.findUniqueOrThrow({ where: { id: clientId } }),
    getGymSettings(),
  ]);
  const now = new Date();
  const invoice = await prisma.feeInvoice.create({
    data: {
      clientId,
      amount: client.monthlyFee,
      dueDate: new Date(now.getFullYear(), now.getMonth(), settings.feeDueDay),
      periodStart: startOfMonth(now),
      periodEnd: endOfMonth(now),
      description: "Monthly membership fee",
      status: "PENDING",
    },
  });
  revalidatePath("/fees");
  revalidatePath("/");
  revalidatePath(`/clients/${clientId}`);
  return invoice;
}

export async function generateMonthlyInvoicesForAll() {
  const [activeClients, settings] = await Promise.all([
    prisma.client.findMany({ where: { status: "ACTIVE" } }),
    getGymSettings(),
  ]);
  const now = new Date();
  const monthStart = startOfMonth(now);
  let created = 0;

  for (const client of activeClients) {
    const existing = await prisma.feeInvoice.findFirst({
      where: {
        clientId: client.id,
        periodStart: { gte: monthStart },
      },
    });
    if (!existing) {
      await prisma.feeInvoice.create({
        data: {
          clientId: client.id,
          amount: client.monthlyFee,
          dueDate: new Date(
            now.getFullYear(),
            now.getMonth(),
            settings.feeDueDay
          ),
          periodStart: startOfMonth(now),
          periodEnd: endOfMonth(now),
          description: "Monthly membership fee",
          status: "PENDING",
        },
      });
      created++;
    }
  }

  revalidatePath("/fees");
  revalidatePath("/");
  return { created };
}
