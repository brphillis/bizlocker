/*
  Warnings:

  - You are about to drop the column `contentImageId` on the `BannerBlockContent` table. All the data in the column will be lost.
  - You are about to drop the column `contentImageId` on the `HeroBlockContent` table. All the data in the column will be lost.
  - You are about to drop the `ContentImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ContentImageToTileBlockContent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BannerBlockContent" DROP CONSTRAINT "BannerBlockContent_contentImageId_fkey";

-- DropForeignKey
ALTER TABLE "ContentImage" DROP CONSTRAINT "ContentImage_imageId_fkey";

-- DropForeignKey
ALTER TABLE "HeroBlockContent" DROP CONSTRAINT "HeroBlockContent_contentImageId_fkey";

-- DropForeignKey
ALTER TABLE "_ContentImageToTileBlockContent" DROP CONSTRAINT "_ContentImageToTileBlockContent_A_fkey";

-- DropForeignKey
ALTER TABLE "_ContentImageToTileBlockContent" DROP CONSTRAINT "_ContentImageToTileBlockContent_B_fkey";

-- AlterTable
ALTER TABLE "BannerBlockContent" DROP COLUMN "contentImageId",
ADD COLUMN     "imageId" INTEGER;

-- AlterTable
ALTER TABLE "HeroBlockContent" DROP COLUMN "contentImageId",
ADD COLUMN     "imageId" INTEGER;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';

-- DropTable
DROP TABLE "ContentImage";

-- DropTable
DROP TABLE "_ContentImageToTileBlockContent";

-- CreateTable
CREATE TABLE "_ImageToTileBlockContent" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ImageToTileBlockContent_AB_unique" ON "_ImageToTileBlockContent"("A", "B");

-- CreateIndex
CREATE INDEX "_ImageToTileBlockContent_B_index" ON "_ImageToTileBlockContent"("B");

-- AddForeignKey
ALTER TABLE "HeroBlockContent" ADD CONSTRAINT "HeroBlockContent_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BannerBlockContent" ADD CONSTRAINT "BannerBlockContent_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImageToTileBlockContent" ADD CONSTRAINT "_ImageToTileBlockContent_A_fkey" FOREIGN KEY ("A") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImageToTileBlockContent" ADD CONSTRAINT "_ImageToTileBlockContent_B_fkey" FOREIGN KEY ("B") REFERENCES "TileBlockContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
