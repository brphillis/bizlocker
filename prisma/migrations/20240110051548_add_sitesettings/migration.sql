-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" SERIAL NOT NULL,
    "navigationStyle" TEXT NOT NULL DEFAULT 'productBasic',
    "spinnerStyle" TEXT NOT NULL DEFAULT 'shirt',
    "announcementMessage" TEXT,
    "announcementIsActive" BOOLEAN NOT NULL DEFAULT false,
    "announcementEndsAt" TEXT,
    "countdownIsActive" BOOLEAN DEFAULT false,
    "maintenanceMessage" TEXT,
    "isUnderMaintenance" BOOLEAN DEFAULT false,
    "createdAt" TEXT,
    "updatedAt" TEXT,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);
