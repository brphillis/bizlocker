/*
  Warnings:

  - You are about to drop the column `name` on the `StockLevel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StockLevel" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
