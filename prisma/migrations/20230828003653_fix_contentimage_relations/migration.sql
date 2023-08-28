-- AlterTable
ALTER TABLE "BannerBlock" ADD COLUMN     "contentImageId" INTEGER;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';

-- CreateTable
CREATE TABLE "_ContentImageToTileBlock" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ContentImageToTileBlock_AB_unique" ON "_ContentImageToTileBlock"("A", "B");

-- CreateIndex
CREATE INDEX "_ContentImageToTileBlock_B_index" ON "_ContentImageToTileBlock"("B");

-- AddForeignKey
ALTER TABLE "BannerBlock" ADD CONSTRAINT "BannerBlock_contentImageId_fkey" FOREIGN KEY ("contentImageId") REFERENCES "ContentImage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContentImageToTileBlock" ADD CONSTRAINT "_ContentImageToTileBlock_A_fkey" FOREIGN KEY ("A") REFERENCES "ContentImage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContentImageToTileBlock" ADD CONSTRAINT "_ContentImageToTileBlock_B_fkey" FOREIGN KEY ("B") REFERENCES "TileBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;
