/*
  Warnings:

  - You are about to drop the column `campaignId` on the `AdvertTileBlock` table. All the data in the column will be lost.
  - You are about to drop the column `promotionId` on the `AdvertTileBlock` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AdvertTileBlock" DROP CONSTRAINT "AdvertTileBlock_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "AdvertTileBlock" DROP CONSTRAINT "AdvertTileBlock_promotionId_fkey";

-- AlterTable
ALTER TABLE "AdvertTileBlock" DROP COLUMN "campaignId",
DROP COLUMN "promotionId";

-- CreateTable
CREATE TABLE "_AdvertTileBlockToCampaign" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AdvertTileBlockToPromotion" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AdvertTileBlockToCampaign_AB_unique" ON "_AdvertTileBlockToCampaign"("A", "B");

-- CreateIndex
CREATE INDEX "_AdvertTileBlockToCampaign_B_index" ON "_AdvertTileBlockToCampaign"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AdvertTileBlockToPromotion_AB_unique" ON "_AdvertTileBlockToPromotion"("A", "B");

-- CreateIndex
CREATE INDEX "_AdvertTileBlockToPromotion_B_index" ON "_AdvertTileBlockToPromotion"("B");

-- AddForeignKey
ALTER TABLE "_AdvertTileBlockToCampaign" ADD CONSTRAINT "_AdvertTileBlockToCampaign_A_fkey" FOREIGN KEY ("A") REFERENCES "AdvertTileBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdvertTileBlockToCampaign" ADD CONSTRAINT "_AdvertTileBlockToCampaign_B_fkey" FOREIGN KEY ("B") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdvertTileBlockToPromotion" ADD CONSTRAINT "_AdvertTileBlockToPromotion_A_fkey" FOREIGN KEY ("A") REFERENCES "AdvertTileBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdvertTileBlockToPromotion" ADD CONSTRAINT "_AdvertTileBlockToPromotion_B_fkey" FOREIGN KEY ("B") REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
