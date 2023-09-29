/*
  Warnings:

  - A unique constraint covering the columns `[heroImageId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "heroImageId" INTEGER;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';

-- CreateIndex
CREATE UNIQUE INDEX "Product_heroImageId_key" ON "Product"("heroImageId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_heroImageId_fkey" FOREIGN KEY ("heroImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
