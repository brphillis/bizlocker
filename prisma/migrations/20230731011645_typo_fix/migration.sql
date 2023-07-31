/*
  Warnings:

  - You are about to drop the `EmailVerfier` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "EmailVerfier";

-- CreateTable
CREATE TABLE "EmailVerifier" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiration" TIMESTAMP(3) NOT NULL DEFAULT NOW() + interval '3 hours',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailVerifier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerifier_email_key" ON "EmailVerifier"("email");
