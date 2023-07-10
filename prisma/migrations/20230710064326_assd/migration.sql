/*
  Warnings:

  - The `campaignId` column on the `BannerBlock` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `promotionId` column on the `BannerBlock` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Campaign` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Campaign` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `promotionId` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Promotion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Promotion` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `B` on the `_BrandToCampaign` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `A` on the `_CampaignToProduct` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `A` on the `_CampaignToTileBlock` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `A` on the `_ProductCategoryToCampaign` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `A` on the `_PromotionToTileBlock` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "BannerBlock" DROP CONSTRAINT "BannerBlock_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "BannerBlock" DROP CONSTRAINT "BannerBlock_promotionId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_promotionId_fkey";

-- DropForeignKey
ALTER TABLE "_BrandToCampaign" DROP CONSTRAINT "_BrandToCampaign_B_fkey";

-- DropForeignKey
ALTER TABLE "_CampaignToProduct" DROP CONSTRAINT "_CampaignToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_CampaignToTileBlock" DROP CONSTRAINT "_CampaignToTileBlock_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductCategoryToCampaign" DROP CONSTRAINT "_ProductCategoryToCampaign_A_fkey";

-- DropForeignKey
ALTER TABLE "_PromotionToTileBlock" DROP CONSTRAINT "_PromotionToTileBlock_A_fkey";

-- DropIndex
DROP INDEX "Campaign_id_key";

-- DropIndex
DROP INDEX "Promotion_id_key";

-- AlterTable
ALTER TABLE "BannerBlock" DROP COLUMN "campaignId",
ADD COLUMN     "campaignId" INTEGER,
DROP COLUMN "promotionId",
ADD COLUMN     "promotionId" INTEGER;

-- AlterTable
ALTER TABLE "Campaign" DROP CONSTRAINT "Campaign_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "promotionId",
ADD COLUMN     "promotionId" INTEGER;

-- AlterTable
ALTER TABLE "Promotion" DROP CONSTRAINT "Promotion_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "_BrandToCampaign" DROP COLUMN "B",
ADD COLUMN     "B" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "_CampaignToProduct" DROP COLUMN "A",
ADD COLUMN     "A" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "_CampaignToTileBlock" DROP COLUMN "A",
ADD COLUMN     "A" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "_ProductCategoryToCampaign" DROP COLUMN "A",
ADD COLUMN     "A" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "_PromotionToTileBlock" DROP COLUMN "A",
ADD COLUMN     "A" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "_BrandToCampaign_AB_unique" ON "_BrandToCampaign"("A", "B");

-- CreateIndex
CREATE INDEX "_BrandToCampaign_B_index" ON "_BrandToCampaign"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CampaignToProduct_AB_unique" ON "_CampaignToProduct"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_CampaignToTileBlock_AB_unique" ON "_CampaignToTileBlock"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductCategoryToCampaign_AB_unique" ON "_ProductCategoryToCampaign"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_PromotionToTileBlock_AB_unique" ON "_PromotionToTileBlock"("A", "B");

-- AddForeignKey
ALTER TABLE "BannerBlock" ADD CONSTRAINT "BannerBlock_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BannerBlock" ADD CONSTRAINT "BannerBlock_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignToProduct" ADD CONSTRAINT "_CampaignToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductCategoryToCampaign" ADD CONSTRAINT "_ProductCategoryToCampaign_A_fkey" FOREIGN KEY ("A") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignToTileBlock" ADD CONSTRAINT "_CampaignToTileBlock_A_fkey" FOREIGN KEY ("A") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromotionToTileBlock" ADD CONSTRAINT "_PromotionToTileBlock_A_fkey" FOREIGN KEY ("A") REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BrandToCampaign" ADD CONSTRAINT "_BrandToCampaign_B_fkey" FOREIGN KEY ("B") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
