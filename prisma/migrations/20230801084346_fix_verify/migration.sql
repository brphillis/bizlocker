/*
  Warnings:

  - You are about to drop the `EmailVerifier` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "VerifyTypes" AS ENUM ('email', 'password');

-- DropTable
DROP TABLE "EmailVerifier";

-- CreateTable
CREATE TABLE "Verifier" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "type" "VerifyTypes" NOT NULL,
    "code" TEXT,
    "expiration" TIMESTAMP(3) NOT NULL DEFAULT NOW() + interval '3 hours',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Verifier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Verifier_email_key" ON "Verifier"("email");
