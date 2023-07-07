/*
  Warnings:

  - You are about to drop the column `bannerBlockId` on the `BannerBlock` table. All the data in the column will be lost.
  - You are about to drop the column `tileBlockId` on the `TileBlock` table. All the data in the column will be lost.
  - You are about to drop the column `tileSize` on the `TileBlock` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[textBlockId]` on the table `Block` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[blockOptionsId]` on the table `Block` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "SortBy" AS ENUM ('createdAt', 'totalSold', 'price', 'name');

-- CreateEnum
CREATE TYPE "SortOrder" AS ENUM ('asc', 'desc');

-- AlterTable
ALTER TABLE "BannerBlock" DROP COLUMN "bannerBlockId";

-- AlterTable
ALTER TABLE "Block" ADD COLUMN     "blockOptionsId" TEXT,
ADD COLUMN     "textBlockId" TEXT;

-- AlterTable
ALTER TABLE "TileBlock" DROP COLUMN "tileBlockId",
DROP COLUMN "tileSize";

-- CreateTable
CREATE TABLE "BlockOptions" (
    "id" TEXT NOT NULL,
    "columns" INTEGER,
    "rows" INTEGER,
    "size" TEXT,
    "sortBy" "SortBy",
    "sortOrder" "SortOrder",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "blockOptionsId" TEXT NOT NULL,

    CONSTRAINT "BlockOptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextBlock" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'text',
    "content" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TextBlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlockOptions_id_key" ON "BlockOptions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BlockOptions_blockOptionsId_key" ON "BlockOptions"("blockOptionsId");

-- CreateIndex
CREATE UNIQUE INDEX "TextBlock_id_key" ON "TextBlock"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Block_textBlockId_key" ON "Block"("textBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "Block_blockOptionsId_key" ON "Block"("blockOptionsId");

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_textBlockId_fkey" FOREIGN KEY ("textBlockId") REFERENCES "TextBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockOptions" ADD CONSTRAINT "BlockOptions_blockOptionsId_fkey" FOREIGN KEY ("blockOptionsId") REFERENCES "Block"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
