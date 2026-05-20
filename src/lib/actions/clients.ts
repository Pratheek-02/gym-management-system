"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import type { ClientStatus } from "@/generated/prisma/client";

export async function getClients(status?: ClientStatus) {
  return prisma.client.findMany({
    where: status ? { status } : undefined,
    include: { membershipPlan: true },
    orderBy: { name: "asc" },
  });
}

export async function getClient(id: string) {
  return prisma.client.findUnique({
    where: { id },
    include: {
      membershipPlan: true,
      invoices: { orderBy: { dueDate: "desc" }, take: 12 },
      payments: { orderBy: { paidAt: "desc" }, take: 20 },
      checkIns: { orderBy: { checkedInAt: "desc" }, take: 30 },
      notes: { orderBy: { createdAt: "desc" } },
    },
  });
}

export async function createClient(data: {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  emergencyContact?: string;
  monthlyFee: number;
  membershipPlanId?: string;
  status?: ClientStatus;
}) {
  const client = await prisma.client.create({
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      address: data.address || null,
      emergencyContact: data.emergencyContact || null,
      monthlyFee: data.monthlyFee,
      membershipPlanId: data.membershipPlanId || null,
      status: data.status ?? "ACTIVE",
    },
  });
  revalidatePath("/");
  revalidatePath("/clients");
  return client;
}

export async function updateClient(
  id: string,
  data: Partial<{
    name: string;
    phone: string;
    email: string;
    address: string;
    emergencyContact: string;
    monthlyFee: number;
    membershipPlanId: string;
    status: ClientStatus;
  }>
) {
  const client = await prisma.client.update({ where: { id }, data });
  revalidatePath("/");
  revalidatePath("/clients");
  revalidatePath(`/clients/${id}`);
  return client;
}

export async function deleteClient(id: string) {
  await prisma.client.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/clients");
  revalidatePath("/fees");
  revalidatePath("/payments");
  revalidatePath("/monitoring");
}

export async function getMembershipPlans() {
  return prisma.membershipPlan.findMany({ orderBy: { monthlyFee: "asc" } });
}

export async function searchClients(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const clients = await prisma.client.findMany({
    include: { membershipPlan: true },
    orderBy: { name: "asc" },
  });

  return clients
    .filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.address?.toLowerCase().includes(q)
    )
    .slice(0, 15);
}
