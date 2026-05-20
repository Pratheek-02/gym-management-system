-- CreateTable
CREATE TABLE "GymSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "gymName" TEXT NOT NULL DEFAULT 'Fitness Garage',
    "tagline" TEXT NOT NULL DEFAULT 'Gym Management System',
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "feeDueDay" INTEGER NOT NULL DEFAULT 10,
    "openingHours" TEXT,
    "footerNote" TEXT,
    "updatedAt" DATETIME NOT NULL
);
