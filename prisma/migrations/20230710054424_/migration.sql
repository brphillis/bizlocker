/*
  Warnings:

  - You are about to drop the column `productBlockName` on the `ProductBlockContent` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productBlockId]` on the table `ProductBlockContent` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ProductBlockContent" DROP CONSTRAINT "ProductBlockContent_productBlockName_fkey";

-- DropIndex
DROP INDEX "ProductBlockContent_productBlockName_key";

-- AlterTable
ALTER TABLE "ProductBlockContent" DROP COLUMN "productBlockName",
ADD COLUMN     "productBlockId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ProductBlockContent_productBlockId_key" ON "ProductBlockContent"("productBlockId");

-- AddForeignKey
ALTER TABLE "ProductBlockContent" ADD CONSTRAINT "ProductBlockContent_productBlockId_fkey" FOREIGN KEY ("productBlockId") REFERENCES "ProductBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;
