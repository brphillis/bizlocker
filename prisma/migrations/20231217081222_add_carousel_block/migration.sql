/*
  Warnings:

  - A unique constraint covering the columns `[carouselBlockId]` on the table `Block` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Block" ADD COLUMN     "carouselBlockId" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';

-- CreateTable
CREATE TABLE "CarouselBlock" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'carousel',
    "createdAt" TEXT NOT NULL DEFAULT '2023-12-07T15:30:00Z',
    "updatedAt" TEXT NOT NULL DEFAULT '2023-12-07T15:30:00Z',

    CONSTRAINT "CarouselBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarouselBlockContent" (
    "id" TEXT NOT NULL,
    "carouselBlockId" TEXT,
    "imageId" INTEGER,
    "createdAt" TEXT NOT NULL DEFAULT '2023-12-07T15:30:00Z',
    "updatedAt" TEXT NOT NULL DEFAULT '2023-12-07T15:30:00Z',

    CONSTRAINT "CarouselBlockContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CarouselBlock_id_key" ON "CarouselBlock"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CarouselBlockContent_id_key" ON "CarouselBlockContent"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CarouselBlockContent_carouselBlockId_key" ON "CarouselBlockContent"("carouselBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "Block_carouselBlockId_key" ON "Block"("carouselBlockId");

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_carouselBlockId_fkey" FOREIGN KEY ("carouselBlockId") REFERENCES "CarouselBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarouselBlockContent" ADD CONSTRAINT "CarouselBlockContent_carouselBlockId_fkey" FOREIGN KEY ("carouselBlockId") REFERENCES "CarouselBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarouselBlockContent" ADD CONSTRAINT "CarouselBlockContent_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
