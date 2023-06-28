-- AlterTable
ALTER TABLE "User" ADD COLUMN     "googleEmail" TEXT,
ADD COLUMN     "googleLogin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "microsoftEmail" TEXT,
ADD COLUMN     "microsoftLogin" BOOLEAN NOT NULL DEFAULT false;
