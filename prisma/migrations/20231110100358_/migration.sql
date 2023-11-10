/*
  Warnings:

  - A unique constraint covering the columns `[productVariantId,storeId]` on the table `StockLevel` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';

-- CreateIndex
CREATE UNIQUE INDEX "StockLevel_productVariantId_storeId_key" ON "StockLevel"("productVariantId", "storeId");
