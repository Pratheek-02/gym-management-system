"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import type { NoteType } from "@/generated/prisma/client";

export async function getActiveCheckIns() {
  return prisma.checkIn.findMany({
    where: { checkedOutAt: null },
    include: { client: true },
    orderBy: { checkedInAt: "desc" },
  });
}

export async function getRecentCheckIns(limit = 50) {
  return prisma.checkIn.findMany({
    include: { client: true },
    orderBy: { checkedInAt: "desc" },
    take: limit,
  });
}

export async function checkInClient(clientId: string) {
  const active = await prisma.checkIn.findFirst({
    where: { clientId, checkedOutAt: null },
  });
  if (active) return active;

  const checkIn = await prisma.checkIn.create({
    data: { clientId },
  });
  revalidatePath("/monitoring");
  revalidatePath("/");
  revalidatePath(`/clients/${clientId}`);
  return checkIn;
}

export async function checkOutClient(checkInId: string) {
  const checkIn = await prisma.checkIn.update({
    where: { id: checkInId },
    data: { checkedOutAt: new Date() },
  });
  revalidatePath("/monitoring");
  revalidatePath("/");
  return checkIn;
}

export async function addClientNote(
  clientId: string,
  content: string,
  type: NoteType = "GENERAL"
) {
  const note = await prisma.clientNote.create({
    data: { clientId, content, type },
  });
  revalidatePath("/monitoring");
  revalidatePath(`/clients/${clientId}`);
  return note;
}

export async function getMonitoringOverview() {
  const [activeInGym, todayCheckIns, recentNotes, activeClients] =
    await Promise.all([
      prisma.checkIn.count({ where: { checkedOutAt: null } }),
      prisma.checkIn.count({
        where: {
          checkedInAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.clientNote.findMany({
        include: { client: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.client.count({ where: { status: "ACTIVE" } }),
    ]);

  return { activeInGym, todayCheckIns, recentNotes, activeClients };
}
