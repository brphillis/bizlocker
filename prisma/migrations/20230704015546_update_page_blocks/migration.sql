/*
  Warnings:

  - Added the required column `type` to the `AdvertBannerBlock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `AdvertTileBlock` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AdvertBannerBlock" DROP CONSTRAINT "AdvertBannerBlock_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "AdvertBannerBlock" DROP CONSTRAINT "AdvertBannerBlock_promotionId_fkey";

-- DropForeignKey
ALTER TABLE "AdvertTileBlock" DROP CONSTRAINT "AdvertTileBlock_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "AdvertTileBlock" DROP CONSTRAINT "AdvertTileBlock_promotionId_fkey";

-- AlterTable
ALTER TABLE "AdvertBannerBlock" ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "campaignId" DROP NOT NULL,
ALTER COLUMN "promotionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "AdvertTileBlock" ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "campaignId" DROP NOT NULL,
ALTER COLUMN "promotionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "AdvertBannerBlock" ADD CONSTRAINT "AdvertBannerBlock_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvertBannerBlock" ADD CONSTRAINT "AdvertBannerBlock_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvertTileBlock" ADD CONSTRAINT "AdvertTileBlock_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvertTileBlock" ADD CONSTRAINT "AdvertTileBlock_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
