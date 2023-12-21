/*
  Warnings:

  - You are about to drop the column `imageId` on the `CarouselBlockContent` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CarouselBlockContent" DROP CONSTRAINT "CarouselBlockContent_imageId_fkey";

-- AlterTable
ALTER TABLE "CarouselBlockContent" DROP COLUMN "imageId";

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';

-- CreateTable
CREATE TABLE "_ImageToCarouselBlockContent" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ImageToCarouselBlockContent_AB_unique" ON "_ImageToCarouselBlockContent"("A", "B");

-- CreateIndex
CREATE INDEX "_ImageToCarouselBlockContent_B_index" ON "_ImageToCarouselBlockContent"("B");

-- AddForeignKey
ALTER TABLE "_ImageToCarouselBlockContent" ADD CONSTRAINT "_ImageToCarouselBlockContent_A_fkey" FOREIGN KEY ("A") REFERENCES "CarouselBlockContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImageToCarouselBlockContent" ADD CONSTRAINT "_ImageToCarouselBlockContent_B_fkey" FOREIGN KEY ("B") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
