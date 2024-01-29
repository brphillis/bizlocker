/*
  Warnings:

  - You are about to drop the column `productSubCategoryId` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `imageId` on the `ProductSubCategory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productSubCategoryTileImageId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_productSubCategoryId_fkey";

-- DropIndex
DROP INDEX "Image_productSubCategoryId_key";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "productSubCategoryId",
ADD COLUMN     "productSubCategoryTileImageId" INTEGER;

-- AlterTable
ALTER TABLE "ProductSubCategory" DROP COLUMN "imageId",
ADD COLUMN     "tileImageId" INTEGER;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';

-- CreateIndex
CREATE UNIQUE INDEX "Image_productSubCategoryTileImageId_key" ON "Image"("productSubCategoryTileImageId");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_productSubCategoryTileImageId_fkey" FOREIGN KEY ("productSubCategoryTileImageId") REFERENCES "ProductSubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
