/*
  Warnings:

  - You are about to drop the `_AdvertTileBlockToCampaign` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AdvertTileBlockToPromotion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AdvertTileBlockToCampaign" DROP CONSTRAINT "_AdvertTileBlockToCampaign_A_fkey";

-- DropForeignKey
ALTER TABLE "_AdvertTileBlockToCampaign" DROP CONSTRAINT "_AdvertTileBlockToCampaign_B_fkey";

-- DropForeignKey
ALTER TABLE "_AdvertTileBlockToPromotion" DROP CONSTRAINT "_AdvertTileBlockToPromotion_A_fkey";

-- DropForeignKey
ALTER TABLE "_AdvertTileBlockToPromotion" DROP CONSTRAINT "_AdvertTileBlockToPromotion_B_fkey";

-- AlterTable
ALTER TABLE "AdvertTileBlock" ADD COLUMN     "campaignId" TEXT,
ADD COLUMN     "promotionId" TEXT;

-- DropTable
DROP TABLE "_AdvertTileBlockToCampaign";

-- DropTable
DROP TABLE "_AdvertTileBlockToPromotion";

-- AddForeignKey
ALTER TABLE "AdvertTileBlock" ADD CONSTRAINT "AdvertTileBlock_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvertTileBlock" ADD CONSTRAINT "AdvertTileBlock_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
