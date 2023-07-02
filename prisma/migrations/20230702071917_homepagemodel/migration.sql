/*
  Warnings:

  - A unique constraint covering the columns `[homePageBannerId]` on the table `Campaign` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[homePageTileRowId]` on the table `Campaign` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[homePagePromotionBannerId]` on the table `Promotion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `homePageId` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "homePageId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "homePageBannerId" INTEGER,
ADD COLUMN     "homePageTileRowId" INTEGER;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "homePageId" INTEGER,
ADD COLUMN     "homePageNewProductsId" INTEGER;

-- AlterTable
ALTER TABLE "Promotion" ADD COLUMN     "homePagePromotionBannerId" INTEGER,
ADD COLUMN     "homePagePromotionTilesId" INTEGER;

-- CreateTable
CREATE TABLE "HomePage" (
    "id" SERIAL NOT NULL,
    "campaignBannerId" TEXT,
    "campaignTileRowId" TEXT,
    "promotionTilesId" TEXT,
    "promotionBannerId" TEXT,

    CONSTRAINT "HomePage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HomePage_id_key" ON "HomePage"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_homePageBannerId_key" ON "Campaign"("homePageBannerId");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_homePageTileRowId_key" ON "Campaign"("homePageTileRowId");

-- CreateIndex
CREATE UNIQUE INDEX "Promotion_homePagePromotionBannerId_key" ON "Promotion"("homePagePromotionBannerId");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_homePageId_fkey" FOREIGN KEY ("homePageId") REFERENCES "HomePage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_homePageBannerId_fkey" FOREIGN KEY ("homePageBannerId") REFERENCES "HomePage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_homePageTileRowId_fkey" FOREIGN KEY ("homePageTileRowId") REFERENCES "HomePage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_homePagePromotionBannerId_fkey" FOREIGN KEY ("homePagePromotionBannerId") REFERENCES "HomePage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_homePagePromotionTilesId_fkey" FOREIGN KEY ("homePagePromotionTilesId") REFERENCES "HomePage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_homePageId_fkey" FOREIGN KEY ("homePageId") REFERENCES "HomePage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_homePageNewProductsId_fkey" FOREIGN KEY ("homePageNewProductsId") REFERENCES "HomePage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
