/*
  Warnings:

  - You are about to drop the column `subProductCategoryId` on the `ProductBlockContent` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductBlockContent" DROP CONSTRAINT "ProductBlockContent_subProductCategoryId_fkey";

-- AlterTable
ALTER TABLE "ProductBlockContent" DROP COLUMN "subProductCategoryId",
ADD COLUMN     "productCategoryId" INTEGER;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';

-- AddForeignKey
ALTER TABLE "ProductBlockContent" ADD CONSTRAINT "ProductBlockContent_productCategoryId_fkey" FOREIGN KEY ("productCategoryId") REFERENCES "ProductCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
