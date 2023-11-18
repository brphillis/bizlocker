/*
  Warnings:

  - You are about to drop the column `subProductCategoryId` on the `ProductSubCategory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductSubCategory" DROP CONSTRAINT "ProductSubCategory_subProductCategoryId_fkey";

-- AlterTable
ALTER TABLE "ProductSubCategory" DROP COLUMN "subProductCategoryId",
ADD COLUMN     "productCategoryId" INTEGER;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';

-- AddForeignKey
ALTER TABLE "ProductSubCategory" ADD CONSTRAINT "ProductSubCategory_productCategoryId_fkey" FOREIGN KEY ("productCategoryId") REFERENCES "ProductCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
