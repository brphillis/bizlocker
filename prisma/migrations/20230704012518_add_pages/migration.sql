/*
  Warnings:

  - You are about to drop the `HomePage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "HomePage";

-- CreateTable
CREATE TABLE "Page" (
    "id" SERIAL NOT NULL,
    "isHomePage" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageItem" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "advertBannerBlockId" TEXT,
    "advertTileBlockId" TEXT,
    "latestProducts" BOOLEAN,
    "latestArticles" BOOLEAN,

    CONSTRAINT "PageItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdvertBannerBlock" (
    "id" TEXT NOT NULL,
    "advertBannerBlockId" TEXT,

    CONSTRAINT "AdvertBannerBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdvertTileBlock" (
    "id" TEXT NOT NULL,
    "tileSize" TEXT NOT NULL DEFAULT 'MEDIUM',
    "advertTileBlockId" TEXT,

    CONSTRAINT "AdvertTileBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PagesToPageItems" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CampaignBannerBlocks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PromotionBannerBlocks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CampaignTileBlocks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PromotionTileBlocks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PageItem_id_key" ON "PageItem"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PageItem_advertBannerBlockId_key" ON "PageItem"("advertBannerBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "PageItem_advertTileBlockId_key" ON "PageItem"("advertTileBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "AdvertBannerBlock_id_key" ON "AdvertBannerBlock"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AdvertBannerBlock_advertBannerBlockId_key" ON "AdvertBannerBlock"("advertBannerBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "AdvertTileBlock_id_key" ON "AdvertTileBlock"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AdvertTileBlock_advertTileBlockId_key" ON "AdvertTileBlock"("advertTileBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "_PagesToPageItems_AB_unique" ON "_PagesToPageItems"("A", "B");

-- CreateIndex
CREATE INDEX "_PagesToPageItems_B_index" ON "_PagesToPageItems"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CampaignBannerBlocks_AB_unique" ON "_CampaignBannerBlocks"("A", "B");

-- CreateIndex
CREATE INDEX "_CampaignBannerBlocks_B_index" ON "_CampaignBannerBlocks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PromotionBannerBlocks_AB_unique" ON "_PromotionBannerBlocks"("A", "B");

-- CreateIndex
CREATE INDEX "_PromotionBannerBlocks_B_index" ON "_PromotionBannerBlocks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CampaignTileBlocks_AB_unique" ON "_CampaignTileBlocks"("A", "B");

-- CreateIndex
CREATE INDEX "_CampaignTileBlocks_B_index" ON "_CampaignTileBlocks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PromotionTileBlocks_AB_unique" ON "_PromotionTileBlocks"("A", "B");

-- CreateIndex
CREATE INDEX "_PromotionTileBlocks_B_index" ON "_PromotionTileBlocks"("B");

-- AddForeignKey
ALTER TABLE "PageItem" ADD CONSTRAINT "PageItem_advertBannerBlockId_fkey" FOREIGN KEY ("advertBannerBlockId") REFERENCES "AdvertBannerBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageItem" ADD CONSTRAINT "PageItem_advertTileBlockId_fkey" FOREIGN KEY ("advertTileBlockId") REFERENCES "AdvertTileBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PagesToPageItems" ADD CONSTRAINT "_PagesToPageItems_A_fkey" FOREIGN KEY ("A") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PagesToPageItems" ADD CONSTRAINT "_PagesToPageItems_B_fkey" FOREIGN KEY ("B") REFERENCES "PageItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignBannerBlocks" ADD CONSTRAINT "_CampaignBannerBlocks_A_fkey" FOREIGN KEY ("A") REFERENCES "AdvertBannerBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignBannerBlocks" ADD CONSTRAINT "_CampaignBannerBlocks_B_fkey" FOREIGN KEY ("B") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromotionBannerBlocks" ADD CONSTRAINT "_PromotionBannerBlocks_A_fkey" FOREIGN KEY ("A") REFERENCES "AdvertBannerBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromotionBannerBlocks" ADD CONSTRAINT "_PromotionBannerBlocks_B_fkey" FOREIGN KEY ("B") REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignTileBlocks" ADD CONSTRAINT "_CampaignTileBlocks_A_fkey" FOREIGN KEY ("A") REFERENCES "AdvertTileBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignTileBlocks" ADD CONSTRAINT "_CampaignTileBlocks_B_fkey" FOREIGN KEY ("B") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromotionTileBlocks" ADD CONSTRAINT "_PromotionTileBlocks_A_fkey" FOREIGN KEY ("A") REFERENCES "AdvertTileBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromotionTileBlocks" ADD CONSTRAINT "_PromotionTileBlocks_B_fkey" FOREIGN KEY ("B") REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
