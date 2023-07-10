/*
  Warnings:

  - You are about to drop the column `brandName` on the `ProductBlockContent` table. All the data in the column will be lost.
  - You are about to drop the column `productCategoryName` on the `ProductBlockContent` table. All the data in the column will be lost.
  - You are about to drop the column `rootCategoryName` on the `ProductBlockContent` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductBlockContent" DROP CONSTRAINT "ProductBlockContent_brandName_fkey";

-- DropForeignKey
ALTER TABLE "ProductBlockContent" DROP CONSTRAINT "ProductBlockContent_productCategoryName_fkey";

-- DropForeignKey
ALTER TABLE "ProductBlockContent" DROP CONSTRAINT "ProductBlockContent_rootCategoryName_fkey";

-- AlterTable
ALTER TABLE "ProductBlockContent" DROP COLUMN "brandName",
DROP COLUMN "productCategoryName",
DROP COLUMN "rootCategoryName",
ADD COLUMN     "brandId" INTEGER,
ADD COLUMN     "productCategoryId" INTEGER,
ADD COLUMN     "rootCategoryId" INTEGER;

-- AddForeignKey
ALTER TABLE "ProductBlockContent" ADD CONSTRAINT "ProductBlockContent_rootCategoryId_fkey" FOREIGN KEY ("rootCategoryId") REFERENCES "RootCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductBlockContent" ADD CONSTRAINT "ProductBlockContent_productCategoryId_fkey" FOREIGN KEY ("productCategoryId") REFERENCES "ProductCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductBlockContent" ADD CONSTRAINT "ProductBlockContent_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;
