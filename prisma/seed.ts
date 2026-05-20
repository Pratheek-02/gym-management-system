import "dotenv/config";
import { addDays, subDays, startOfMonth, endOfMonth } from "date-fns";
import { prisma } from "../src/lib/db";

async function main() {
  await prisma.gymSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      gymName: "Fitness Garage",
      tagline: "Gym Management System",
      phone: "9876500000",
      email: "info@fitnessgarage.com",
      address: "123 Fitness Street, Your City",
      currency: "INR",
      feeDueDay: 10,
      openingHours: "Mon–Sat 6:00 AM – 10:00 PM",
      footerNote: "Train hard. Stay consistent.",
    },
    update: {},
  });

  await prisma.payment.deleteMany();
  await prisma.feeInvoice.deleteMany();
  await prisma.checkIn.deleteMany();
  await prisma.clientNote.deleteMany();
  await prisma.client.deleteMany();
  await prisma.membershipPlan.deleteMany();

  const basic = await prisma.membershipPlan.create({
    data: { name: "Basic", monthlyFee: 1500, description: "Gym access only" },
  });
  const premium = await prisma.membershipPlan.create({
    data: {
      name: "Premium",
      monthlyFee: 2500,
      description: "Gym + trainer sessions",
    },
  });
  const elite = await prisma.membershipPlan.create({
    data: {
      name: "Elite",
      monthlyFee: 4000,
      description: "All access + nutrition plan",
    },
  });

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const clients = await Promise.all([
    prisma.client.create({
      data: {
        name: "Rahul Sharma",
        phone: "9876543210",
        email: "rahul@email.com",
        status: "ACTIVE",
        monthlyFee: 2500,
        membershipPlanId: premium.id,
        joinDate: subDays(now, 120),
      },
    }),
    prisma.client.create({
      data: {
        name: "Priya Patel",
        phone: "9876543211",
        email: "priya@email.com",
        status: "ACTIVE",
        monthlyFee: 4000,
        membershipPlanId: elite.id,
        joinDate: subDays(now, 90),
      },
    }),
    prisma.client.create({
      data: {
        name: "Amit Kumar",
        phone: "9876543212",
        status: "ACTIVE",
        monthlyFee: 1500,
        membershipPlanId: basic.id,
        joinDate: subDays(now, 45),
      },
    }),
    prisma.client.create({
      data: {
        name: "Sneha Reddy",
        phone: "9876543213",
        email: "sneha@email.com",
        status: "ACTIVE",
        monthlyFee: 2500,
        membershipPlanId: premium.id,
        joinDate: subDays(now, 30),
      },
    }),
    prisma.client.create({
      data: {
        name: "Vikram Singh",
        phone: "9876543214",
        status: "INACTIVE",
        monthlyFee: 1500,
        membershipPlanId: basic.id,
        joinDate: subDays(now, 200),
      },
    }),
    prisma.client.create({
      data: {
        name: "Ananya Iyer",
        phone: "9876543215",
        email: "ananya@email.com",
        status: "SUSPENDED",
        monthlyFee: 2500,
        membershipPlanId: premium.id,
        joinDate: subDays(now, 60),
      },
    }),
  ]);

  for (const client of clients.slice(0, 4)) {
    const paidInvoice = await prisma.feeInvoice.create({
      data: {
        clientId: client.id,
        amount: client.monthlyFee,
        amountPaid: client.monthlyFee,
        dueDate: subDays(now, 5),
        periodStart: monthStart,
        periodEnd: monthEnd,
        status: "PAID",
        description: "Monthly membership",
      },
    });
    await prisma.payment.create({
      data: {
        clientId: client.id,
        feeInvoiceId: paidInvoice.id,
        amount: client.monthlyFee,
        method: "UPI",
        paidAt: subDays(now, 8),
      },
    });
  }

  await prisma.feeInvoice.create({
    data: {
      clientId: clients[4].id,
      amount: 1500,
      amountPaid: 0,
      dueDate: subDays(now, 15),
      periodStart: monthStart,
      periodEnd: monthEnd,
      status: "OVERDUE",
      description: "Monthly membership",
    },
  });

  await prisma.feeInvoice.create({
    data: {
      clientId: clients[5].id,
      amount: 2500,
      amountPaid: 1000,
      dueDate: addDays(now, 5),
      periodStart: monthStart,
      periodEnd: monthEnd,
      status: "PARTIAL",
      description: "Monthly membership",
    },
  });

  await prisma.feeInvoice.create({
    data: {
      clientId: clients[2].id,
      amount: 1500,
      amountPaid: 0,
      dueDate: addDays(now, 3),
      periodStart: monthStart,
      periodEnd: monthEnd,
      status: "PENDING",
      description: "Monthly membership",
    },
  });

  for (let i = 0; i < 3; i++) {
    await prisma.checkIn.create({
      data: {
        clientId: clients[0].id,
        checkedInAt: subDays(now, i),
        checkedOutAt: subDays(now, i),
      },
    });
    await prisma.checkIn.create({
      data: {
        clientId: clients[1].id,
        checkedInAt: subDays(now, i + 1),
      },
    });
  }

  await prisma.checkIn.create({
    data: { clientId: clients[0].id, checkedInAt: now },
  });

  await prisma.clientNote.createMany({
    data: [
      {
        clientId: clients[0].id,
        content: "Progressing well on strength program. Increase weights next week.",
        type: "MONITORING",
      },
      {
        clientId: clients[1].id,
        content: "Requested diet plan update for cutting phase.",
        type: "HEALTH",
      },
      {
        clientId: clients[5].id,
        content: "Account suspended due to partial payment. Follow up required.",
        type: "PAYMENT",
      },
    ],
  });

  console.log("Seed completed: 6 clients, plans, invoices, payments, check-ins");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
