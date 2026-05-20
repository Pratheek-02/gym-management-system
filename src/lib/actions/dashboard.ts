"use server";

import { prisma } from "@/lib/db";
import { startOfMonth } from "date-fns";

export async function getDashboardStats() {
  const now = new Date();
  const monthStart = startOfMonth(now);

  const [
    totalClients,
    activeClients,
    pendingInvoices,
    overdueInvoices,
    monthlyPayments,
    activeInGym,
  ] = await Promise.all([
    prisma.client.count(),
    prisma.client.count({ where: { status: "ACTIVE" } }),
    prisma.feeInvoice.findMany({
      where: { status: { in: ["PENDING", "PARTIAL"] } },
      include: { client: true },
    }),
    prisma.feeInvoice.findMany({
      where: {
        OR: [
          { status: "OVERDUE" },
          {
            status: "PENDING",
            dueDate: { lt: now },
          },
        ],
      },
      include: { client: true },
    }),
    prisma.payment.aggregate({
      where: { paidAt: { gte: monthStart } },
      _sum: { amount: true },
    }),
    prisma.checkIn.count({ where: { checkedOutAt: null } }),
  ]);

  const pendingAmount = pendingInvoices.reduce(
    (sum, i) => sum + (i.amount - i.amountPaid),
    0
  );
  const overdueAmount = overdueInvoices.reduce(
    (sum, i) => sum + (i.amount - i.amountPaid),
    0
  );

  const recentPayments = await prisma.payment.findMany({
    include: { client: true },
    orderBy: { paidAt: "desc" },
    take: 5,
  });

  return {
    totalClients,
    activeClients,
    pendingCount: pendingInvoices.length,
    pendingAmount,
    overdueCount: overdueInvoices.length,
    overdueAmount,
    monthlyRevenue: monthlyPayments._sum.amount ?? 0,
    activeInGym,
    pendingInvoices: pendingInvoices.slice(0, 5),
    overdueInvoices: overdueInvoices.slice(0, 5),
    recentPayments,
  };
}
