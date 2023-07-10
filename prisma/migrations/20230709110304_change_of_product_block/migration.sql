/*
  Warnings:

  - You are about to drop the `_BrandsToProductBlock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductCategoryToProductBlock` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[productBlockId]` on the table `Brand` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productBlockId]` on the table `ProductCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productBlockId]` on the table `RootCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_BrandsToProductBlock" DROP CONSTRAINT "_BrandsToProductBlock_A_fkey";

-- DropForeignKey
ALTER TABLE "_BrandsToProductBlock" DROP CONSTRAINT "_BrandsToProductBlock_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProductCategoryToProductBlock" DROP CONSTRAINT "_ProductCategoryToProductBlock_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductCategoryToProductBlock" DROP CONSTRAINT "_ProductCategoryToProductBlock_B_fkey";

-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "productBlockId" TEXT;

-- AlterTable
ALTER TABLE "ProductCategory" ADD COLUMN     "productBlockId" TEXT;

-- AlterTable
ALTER TABLE "RootCategory" ADD COLUMN     "productBlockId" TEXT;

-- DropTable
DROP TABLE "_BrandsToProductBlock";

-- DropTable
DROP TABLE "_ProductCategoryToProductBlock";

-- CreateTable
CREATE TABLE "ProductBlockContent" (
    "id" TEXT NOT NULL,
    "productBlockId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductBlockContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductBlockContent_id_key" ON "ProductBlockContent"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductBlockContent_productBlockId_key" ON "ProductBlockContent"("productBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_productBlockId_key" ON "Brand"("productBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_productBlockId_key" ON "ProductCategory"("productBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "RootCategory_productBlockId_key" ON "RootCategory"("productBlockId");

-- AddForeignKey
ALTER TABLE "ProductBlockContent" ADD CONSTRAINT "ProductBlockContent_productBlockId_fkey" FOREIGN KEY ("productBlockId") REFERENCES "ProductBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RootCategory" ADD CONSTRAINT "RootCategory_productBlockId_fkey" FOREIGN KEY ("productBlockId") REFERENCES "ProductBlockContent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_productBlockId_fkey" FOREIGN KEY ("productBlockId") REFERENCES "ProductBlockContent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_productBlockId_fkey" FOREIGN KEY ("productBlockId") REFERENCES "ProductBlockContent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
