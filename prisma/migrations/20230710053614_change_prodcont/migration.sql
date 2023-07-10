/*
  Warnings:

  - You are about to drop the column `brandId` on the `ProductBlockContent` table. All the data in the column will be lost.
  - You are about to drop the column `productBlockId` on the `ProductBlockContent` table. All the data in the column will be lost.
  - You are about to drop the column `productCategoryId` on the `ProductBlockContent` table. All the data in the column will be lost.
  - You are about to drop the column `rootCategoryId` on the `ProductBlockContent` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productBlockName]` on the table `ProductBlockContent` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ProductBlockContent" DROP CONSTRAINT "ProductBlockContent_brandId_fkey";

-- DropForeignKey
ALTER TABLE "ProductBlockContent" DROP CONSTRAINT "ProductBlockContent_productBlockId_fkey";

-- DropForeignKey
ALTER TABLE "ProductBlockContent" DROP CONSTRAINT "ProductBlockContent_productCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "ProductBlockContent" DROP CONSTRAINT "ProductBlockContent_rootCategoryId_fkey";

-- DropIndex
DROP INDEX "ProductBlockContent_productBlockId_key";

-- AlterTable
ALTER TABLE "ProductBlockContent" DROP COLUMN "brandId",
DROP COLUMN "productBlockId",
DROP COLUMN "productCategoryId",
DROP COLUMN "rootCategoryId",
ADD COLUMN     "brandName" TEXT,
ADD COLUMN     "productBlockName" TEXT,
ADD COLUMN     "productCategoryName" TEXT,
ADD COLUMN     "rootCategoryName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ProductBlockContent_productBlockName_key" ON "ProductBlockContent"("productBlockName");

-- AddForeignKey
ALTER TABLE "ProductBlockContent" ADD CONSTRAINT "ProductBlockContent_productBlockName_fkey" FOREIGN KEY ("productBlockName") REFERENCES "ProductBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductBlockContent" ADD CONSTRAINT "ProductBlockContent_rootCategoryName_fkey" FOREIGN KEY ("rootCategoryName") REFERENCES "RootCategory"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductBlockContent" ADD CONSTRAINT "ProductBlockContent_productCategoryName_fkey" FOREIGN KEY ("productCategoryName") REFERENCES "ProductCategory"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductBlockContent" ADD CONSTRAINT "ProductBlockContent_brandName_fkey" FOREIGN KEY ("brandName") REFERENCES "Brand"("name") ON DELETE SET NULL ON UPDATE CASCADE;
