/*
  Warnings:

  - You are about to drop the `_CampaignBannerBlocks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CampaignTileBlocks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PromotionBannerBlocks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PromotionTileBlocks` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[campaignId]` on the table `AdvertBannerBlock` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[promotionId]` on the table `AdvertBannerBlock` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[campaignId]` on the table `AdvertTileBlock` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[promotionId]` on the table `AdvertTileBlock` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `campaignId` to the `AdvertBannerBlock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `promotionId` to the `AdvertBannerBlock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `campaignId` to the `AdvertTileBlock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `promotionId` to the `AdvertTileBlock` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CampaignBannerBlocks" DROP CONSTRAINT "_CampaignBannerBlocks_A_fkey";

-- DropForeignKey
ALTER TABLE "_CampaignBannerBlocks" DROP CONSTRAINT "_CampaignBannerBlocks_B_fkey";

-- DropForeignKey
ALTER TABLE "_CampaignTileBlocks" DROP CONSTRAINT "_CampaignTileBlocks_A_fkey";

-- DropForeignKey
ALTER TABLE "_CampaignTileBlocks" DROP CONSTRAINT "_CampaignTileBlocks_B_fkey";

-- DropForeignKey
ALTER TABLE "_PromotionBannerBlocks" DROP CONSTRAINT "_PromotionBannerBlocks_A_fkey";

-- DropForeignKey
ALTER TABLE "_PromotionBannerBlocks" DROP CONSTRAINT "_PromotionBannerBlocks_B_fkey";

-- DropForeignKey
ALTER TABLE "_PromotionTileBlocks" DROP CONSTRAINT "_PromotionTileBlocks_A_fkey";

-- DropForeignKey
ALTER TABLE "_PromotionTileBlocks" DROP CONSTRAINT "_PromotionTileBlocks_B_fkey";

-- AlterTable
ALTER TABLE "AdvertBannerBlock" ADD COLUMN     "campaignId" TEXT NOT NULL,
ADD COLUMN     "promotionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AdvertTileBlock" ADD COLUMN     "campaignId" TEXT NOT NULL,
ADD COLUMN     "promotionId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_CampaignBannerBlocks";

-- DropTable
DROP TABLE "_CampaignTileBlocks";

-- DropTable
DROP TABLE "_PromotionBannerBlocks";

-- DropTable
DROP TABLE "_PromotionTileBlocks";

-- CreateIndex
CREATE UNIQUE INDEX "AdvertBannerBlock_campaignId_key" ON "AdvertBannerBlock"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "AdvertBannerBlock_promotionId_key" ON "AdvertBannerBlock"("promotionId");

-- CreateIndex
CREATE UNIQUE INDEX "AdvertTileBlock_campaignId_key" ON "AdvertTileBlock"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "AdvertTileBlock_promotionId_key" ON "AdvertTileBlock"("promotionId");

-- AddForeignKey
ALTER TABLE "AdvertBannerBlock" ADD CONSTRAINT "AdvertBannerBlock_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvertBannerBlock" ADD CONSTRAINT "AdvertBannerBlock_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvertTileBlock" ADD CONSTRAINT "AdvertTileBlock_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvertTileBlock" ADD CONSTRAINT "AdvertTileBlock_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
