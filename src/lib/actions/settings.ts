"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

const DEFAULT_SETTINGS = {
  id: "default",
  gymName: "Fitness Garage",
  tagline: "Gym Management System",
  currency: "INR",
  feeDueDay: 10,
};

export async function getGymSettings() {
  return prisma.gymSettings.upsert({
    where: { id: "default" },
    create: DEFAULT_SETTINGS,
    update: {},
  });
}

export async function updateGymSettings(data: {
  gymName: string;
  tagline: string;
  phone?: string;
  email?: string;
  address?: string;
  currency: string;
  feeDueDay: number;
  openingHours?: string;
  footerNote?: string;
}) {
  const settings = await prisma.gymSettings.upsert({
    where: { id: "default" },
    create: { id: "default", ...data },
    update: data,
  });
  revalidatePath("/", "layout");
  revalidatePath("/settings");
  return settings;
}

export async function createMembershipPlan(data: {
  name: string;
  monthlyFee: number;
  description?: string;
}) {
  const plan = await prisma.membershipPlan.create({ data });
  revalidatePath("/settings");
  revalidatePath("/clients");
  return plan;
}

export async function updateMembershipPlan(
  id: string,
  data: { name: string; monthlyFee: number; description?: string }
) {
  const plan = await prisma.membershipPlan.update({ where: { id }, data });
  revalidatePath("/settings");
  revalidatePath("/clients");
  return plan;
}

export async function deleteMembershipPlan(id: string) {
  await prisma.membershipPlan.delete({ where: { id } });
  revalidatePath("/settings");
  revalidatePath("/clients");
}
