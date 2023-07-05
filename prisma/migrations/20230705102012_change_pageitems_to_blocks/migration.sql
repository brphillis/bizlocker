/*
  Warnings:

  - You are about to drop the `PageItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PageItem" DROP CONSTRAINT "PageItem_advertBannerBlockId_fkey";

-- DropForeignKey
ALTER TABLE "PageItem" DROP CONSTRAINT "PageItem_advertTileBlockId_fkey";

-- DropForeignKey
ALTER TABLE "PageItem" DROP CONSTRAINT "PageItem_pageId_fkey";

-- DropTable
DROP TABLE "PageItem";

-- CreateTable
CREATE TABLE "Block" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "pageId" INTEGER NOT NULL,
    "advertBannerBlockId" TEXT,
    "advertTileBlockId" TEXT,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Block_id_key" ON "Block"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Block_advertBannerBlockId_key" ON "Block"("advertBannerBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "Block_advertTileBlockId_key" ON "Block"("advertTileBlockId");

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_advertBannerBlockId_fkey" FOREIGN KEY ("advertBannerBlockId") REFERENCES "AdvertBannerBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_advertTileBlockId_fkey" FOREIGN KEY ("advertTileBlockId") REFERENCES "AdvertTileBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;
