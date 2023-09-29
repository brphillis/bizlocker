/*
  Warnings:

  - A unique constraint covering the columns `[heroBlockId]` on the table `Block` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Block" ADD COLUMN     "heroBlockId" TEXT;

-- AlterTable
ALTER TABLE "BlockOptions" ADD COLUMN     "backgroundColor" "Color",
ADD COLUMN     "primaryLink" TEXT,
ADD COLUMN     "secondaryLink" TEXT,
ADD COLUMN     "shortText" TEXT,
ADD COLUMN     "shortTextColor" "Color",
ADD COLUMN     "title" TEXT,
ADD COLUMN     "titleColor" "Color";

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';

-- CreateTable
CREATE TABLE "HeroBlock" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'hero',
    "type" TEXT NOT NULL,
    "productId" INTEGER,
    "contentImageId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroBlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HeroBlock_id_key" ON "HeroBlock"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Block_heroBlockId_key" ON "Block"("heroBlockId");

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_heroBlockId_fkey" FOREIGN KEY ("heroBlockId") REFERENCES "HeroBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeroBlock" ADD CONSTRAINT "HeroBlock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeroBlock" ADD CONSTRAINT "HeroBlock_contentImageId_fkey" FOREIGN KEY ("contentImageId") REFERENCES "ContentImage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
