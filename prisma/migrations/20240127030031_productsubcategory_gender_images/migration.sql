/*
  Warnings:

  - A unique constraint covering the columns `[productSubCategoryMaleImageId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productSubCategoryFemaleImageId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productSubCategoryKidImageId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "productSubCategoryFemaleImageId" INTEGER,
ADD COLUMN     "productSubCategoryKidImageId" INTEGER,
ADD COLUMN     "productSubCategoryMaleImageId" INTEGER;

-- AlterTable
ALTER TABLE "ProductSubCategory" ADD COLUMN     "femaleImageId" INTEGER,
ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'UNISEX',
ADD COLUMN     "kidImageId" INTEGER,
ADD COLUMN     "maleImageId" INTEGER;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';

-- CreateIndex
CREATE UNIQUE INDEX "Image_productSubCategoryMaleImageId_key" ON "Image"("productSubCategoryMaleImageId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_productSubCategoryFemaleImageId_key" ON "Image"("productSubCategoryFemaleImageId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_productSubCategoryKidImageId_key" ON "Image"("productSubCategoryKidImageId");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_productSubCategoryMaleImageId_fkey" FOREIGN KEY ("productSubCategoryMaleImageId") REFERENCES "ProductSubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_productSubCategoryFemaleImageId_fkey" FOREIGN KEY ("productSubCategoryFemaleImageId") REFERENCES "ProductSubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_productSubCategoryKidImageId_fkey" FOREIGN KEY ("productSubCategoryKidImageId") REFERENCES "ProductSubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
