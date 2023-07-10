/*
  Warnings:

  - You are about to drop the column `productBlockId` on the `Brand` table. All the data in the column will be lost.
  - You are about to drop the column `productBlockId` on the `ProductCategory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Brand" DROP CONSTRAINT "Brand_productBlockId_fkey";

-- DropForeignKey
ALTER TABLE "ProductCategory" DROP CONSTRAINT "ProductCategory_productBlockId_fkey";

-- DropForeignKey
ALTER TABLE "RootCategory" DROP CONSTRAINT "RootCategory_productBlockId_fkey";

-- DropIndex
DROP INDEX "Brand_productBlockId_key";

-- DropIndex
DROP INDEX "ProductCategory_productBlockId_key";

-- AlterTable
ALTER TABLE "Brand" DROP COLUMN "productBlockId";

-- AlterTable
ALTER TABLE "ProductBlockContent" ADD COLUMN     "brandId" INTEGER,
ADD COLUMN     "productCategoryId" INTEGER,
ADD COLUMN     "rootCategoryId" INTEGER;

-- AlterTable
ALTER TABLE "ProductCategory" DROP COLUMN "productBlockId";

-- AddForeignKey
ALTER TABLE "ProductBlockContent" ADD CONSTRAINT "ProductBlockContent_rootCategoryId_fkey" FOREIGN KEY ("rootCategoryId") REFERENCES "RootCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductBlockContent" ADD CONSTRAINT "ProductBlockContent_productCategoryId_fkey" FOREIGN KEY ("productCategoryId") REFERENCES "ProductCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductBlockContent" ADD CONSTRAINT "ProductBlockContent_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;
