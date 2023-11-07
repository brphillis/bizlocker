/*
  Warnings:

  - A unique constraint covering the columns `[mapBlockId]` on the table `Block` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Block" ADD COLUMN     "mapBlockId" TEXT;

-- AlterTable
ALTER TABLE "Staff" ALTER COLUMN "role" SET DEFAULT 'STAFF';

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';

-- CreateTable
CREATE TABLE "MapBlock" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'map',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MapBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MapBlockContent" (
    "id" TEXT NOT NULL,
    "mapBlockId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MapBlockContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_StoreToMapBlockContent" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "MapBlock_id_key" ON "MapBlock"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MapBlockContent_id_key" ON "MapBlockContent"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MapBlockContent_mapBlockId_key" ON "MapBlockContent"("mapBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "_StoreToMapBlockContent_AB_unique" ON "_StoreToMapBlockContent"("A", "B");

-- CreateIndex
CREATE INDEX "_StoreToMapBlockContent_B_index" ON "_StoreToMapBlockContent"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Block_mapBlockId_key" ON "Block"("mapBlockId");

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_mapBlockId_fkey" FOREIGN KEY ("mapBlockId") REFERENCES "MapBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapBlockContent" ADD CONSTRAINT "MapBlockContent_mapBlockId_fkey" FOREIGN KEY ("mapBlockId") REFERENCES "MapBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StoreToMapBlockContent" ADD CONSTRAINT "_StoreToMapBlockContent_A_fkey" FOREIGN KEY ("A") REFERENCES "MapBlockContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StoreToMapBlockContent" ADD CONSTRAINT "_StoreToMapBlockContent_B_fkey" FOREIGN KEY ("B") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
