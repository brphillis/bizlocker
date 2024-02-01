/*
  Warnings:

  - You are about to drop the column `imageId` on the `Brand` table. All the data in the column will be lost.
  - You are about to drop the column `brandId` on the `Image` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[brandHeroImageId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_brandId_fkey";

-- DropIndex
DROP INDEX "Image_brandId_key";

-- AlterTable
ALTER TABLE "Brand" DROP COLUMN "imageId",
ADD COLUMN     "heroImageId" INTEGER;

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "brandId",
ADD COLUMN     "brandHeroImageId" INTEGER;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';

-- CreateIndex
CREATE UNIQUE INDEX "Image_brandHeroImageId_key" ON "Image"("brandHeroImageId");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_brandHeroImageId_fkey" FOREIGN KEY ("brandHeroImageId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;
