-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';

-- CreateTable
CREATE TABLE "_BrandToTileBlockContent" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BrandToTileBlockContent_AB_unique" ON "_BrandToTileBlockContent"("A", "B");

-- CreateIndex
CREATE INDEX "_BrandToTileBlockContent_B_index" ON "_BrandToTileBlockContent"("B");

-- AddForeignKey
ALTER TABLE "_BrandToTileBlockContent" ADD CONSTRAINT "_BrandToTileBlockContent_A_fkey" FOREIGN KEY ("A") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BrandToTileBlockContent" ADD CONSTRAINT "_BrandToTileBlockContent_B_fkey" FOREIGN KEY ("B") REFERENCES "TileBlockContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
