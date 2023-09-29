/*
  Warnings:

  - You are about to drop the column `campaignId` on the `BannerBlock` table. All the data in the column will be lost.
  - You are about to drop the column `contentImageId` on the `BannerBlock` table. All the data in the column will be lost.
  - You are about to drop the column `promotionId` on the `BannerBlock` table. All the data in the column will be lost.
  - You are about to drop the column `blockOptionsId` on the `Block` table. All the data in the column will be lost.
  - You are about to drop the column `contentImageId` on the `HeroBlock` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `HeroBlock` table. All the data in the column will be lost.
  - You are about to drop the column `productBlockId` on the `ProductCategory` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `TextBlock` table. All the data in the column will be lost.
  - You are about to drop the `_CampaignToTileBlock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ContentImageToTileBlock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PromotionToTileBlock` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BannerBlock" DROP CONSTRAINT "BannerBlock_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "BannerBlock" DROP CONSTRAINT "BannerBlock_contentImageId_fkey";

-- DropForeignKey
ALTER TABLE "BannerBlock" DROP CONSTRAINT "BannerBlock_promotionId_fkey";

-- DropForeignKey
ALTER TABLE "Block" DROP CONSTRAINT "Block_blockOptionsId_fkey";

-- DropForeignKey
ALTER TABLE "HeroBlock" DROP CONSTRAINT "HeroBlock_contentImageId_fkey";

-- DropForeignKey
ALTER TABLE "HeroBlock" DROP CONSTRAINT "HeroBlock_productId_fkey";

-- DropForeignKey
ALTER TABLE "_CampaignToTileBlock" DROP CONSTRAINT "_CampaignToTileBlock_A_fkey";

-- DropForeignKey
ALTER TABLE "_CampaignToTileBlock" DROP CONSTRAINT "_CampaignToTileBlock_B_fkey";

-- DropForeignKey
ALTER TABLE "_ContentImageToTileBlock" DROP CONSTRAINT "_ContentImageToTileBlock_A_fkey";

-- DropForeignKey
ALTER TABLE "_ContentImageToTileBlock" DROP CONSTRAINT "_ContentImageToTileBlock_B_fkey";

-- DropForeignKey
ALTER TABLE "_PromotionToTileBlock" DROP CONSTRAINT "_PromotionToTileBlock_A_fkey";

-- DropForeignKey
ALTER TABLE "_PromotionToTileBlock" DROP CONSTRAINT "_PromotionToTileBlock_B_fkey";

-- DropIndex
DROP INDEX "Block_blockOptionsId_key";

-- DropIndex
DROP INDEX "ProductCategory_productBlockId_key";

-- AlterTable
ALTER TABLE "ArticleCategory" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "BannerBlock" DROP COLUMN "campaignId",
DROP COLUMN "contentImageId",
DROP COLUMN "promotionId";

-- AlterTable
ALTER TABLE "Block" DROP COLUMN "blockOptionsId";

-- AlterTable
ALTER TABLE "BlockOptions" ADD COLUMN     "blockId" TEXT,
ADD COLUMN     "order" INTEGER;

-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "HeroBlock" DROP COLUMN "contentImageId",
DROP COLUMN "productId";

-- AlterTable
ALTER TABLE "ProductCategory" DROP COLUMN "productBlockId",
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ProductSubCategory" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "TextBlock" DROP COLUMN "content";

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';

-- DropTable
DROP TABLE "_CampaignToTileBlock";

-- DropTable
DROP TABLE "_ContentImageToTileBlock";

-- DropTable
DROP TABLE "_PromotionToTileBlock";

-- CreateTable
CREATE TABLE "HeroBlockContent" (
    "id" TEXT NOT NULL,
    "contentImageId" INTEGER,
    "heroBlockId" TEXT,
    "productId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroBlockContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BannerBlockContent" (
    "id" TEXT NOT NULL,
    "bannerBlockId" TEXT,
    "campaignId" INTEGER,
    "contentImageId" INTEGER,
    "promotionId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BannerBlockContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TileBlockContent" (
    "id" TEXT NOT NULL,
    "tileBlockId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TileBlockContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextBlockContent" (
    "id" TEXT NOT NULL,
    "richText" TEXT[],
    "textBlockId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TextBlockContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ContentImageToTileBlockContent" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CampaignToTileBlockContent" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PromotionToTileBlockContent" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "HeroBlockContent_id_key" ON "HeroBlockContent"("id");

-- CreateIndex
CREATE UNIQUE INDEX "HeroBlockContent_heroBlockId_key" ON "HeroBlockContent"("heroBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "BannerBlockContent_id_key" ON "BannerBlockContent"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BannerBlockContent_bannerBlockId_key" ON "BannerBlockContent"("bannerBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "TileBlockContent_id_key" ON "TileBlockContent"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TileBlockContent_tileBlockId_key" ON "TileBlockContent"("tileBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "TextBlockContent_id_key" ON "TextBlockContent"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TextBlockContent_textBlockId_key" ON "TextBlockContent"("textBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "_ContentImageToTileBlockContent_AB_unique" ON "_ContentImageToTileBlockContent"("A", "B");

-- CreateIndex
CREATE INDEX "_ContentImageToTileBlockContent_B_index" ON "_ContentImageToTileBlockContent"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CampaignToTileBlockContent_AB_unique" ON "_CampaignToTileBlockContent"("A", "B");

-- CreateIndex
CREATE INDEX "_CampaignToTileBlockContent_B_index" ON "_CampaignToTileBlockContent"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PromotionToTileBlockContent_AB_unique" ON "_PromotionToTileBlockContent"("A", "B");

-- CreateIndex
CREATE INDEX "_PromotionToTileBlockContent_B_index" ON "_PromotionToTileBlockContent"("B");

-- AddForeignKey
ALTER TABLE "BlockOptions" ADD CONSTRAINT "BlockOptions_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeroBlockContent" ADD CONSTRAINT "HeroBlockContent_contentImageId_fkey" FOREIGN KEY ("contentImageId") REFERENCES "ContentImage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeroBlockContent" ADD CONSTRAINT "HeroBlockContent_heroBlockId_fkey" FOREIGN KEY ("heroBlockId") REFERENCES "HeroBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeroBlockContent" ADD CONSTRAINT "HeroBlockContent_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BannerBlockContent" ADD CONSTRAINT "BannerBlockContent_bannerBlockId_fkey" FOREIGN KEY ("bannerBlockId") REFERENCES "BannerBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BannerBlockContent" ADD CONSTRAINT "BannerBlockContent_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BannerBlockContent" ADD CONSTRAINT "BannerBlockContent_contentImageId_fkey" FOREIGN KEY ("contentImageId") REFERENCES "ContentImage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BannerBlockContent" ADD CONSTRAINT "BannerBlockContent_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TileBlockContent" ADD CONSTRAINT "TileBlockContent_tileBlockId_fkey" FOREIGN KEY ("tileBlockId") REFERENCES "TileBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextBlockContent" ADD CONSTRAINT "TextBlockContent_textBlockId_fkey" FOREIGN KEY ("textBlockId") REFERENCES "TextBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContentImageToTileBlockContent" ADD CONSTRAINT "_ContentImageToTileBlockContent_A_fkey" FOREIGN KEY ("A") REFERENCES "ContentImage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContentImageToTileBlockContent" ADD CONSTRAINT "_ContentImageToTileBlockContent_B_fkey" FOREIGN KEY ("B") REFERENCES "TileBlockContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignToTileBlockContent" ADD CONSTRAINT "_CampaignToTileBlockContent_A_fkey" FOREIGN KEY ("A") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignToTileBlockContent" ADD CONSTRAINT "_CampaignToTileBlockContent_B_fkey" FOREIGN KEY ("B") REFERENCES "TileBlockContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromotionToTileBlockContent" ADD CONSTRAINT "_PromotionToTileBlockContent_A_fkey" FOREIGN KEY ("A") REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromotionToTileBlockContent" ADD CONSTRAINT "_PromotionToTileBlockContent_B_fkey" FOREIGN KEY ("B") REFERENCES "TileBlockContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
