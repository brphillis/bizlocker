/*
  Warnings:

  - Added the required column `createdBy` to the `StockTransferRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StockTransferRequest" ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "createdBy" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
