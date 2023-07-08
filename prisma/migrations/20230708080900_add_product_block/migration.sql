/*
  Warnings:

  - A unique constraint covering the columns `[productBlockId]` on the table `Block` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Block" ADD COLUMN     "productBlockId" TEXT;

-- AlterTable
ALTER TABLE "BlockOptions" ADD COLUMN     "count" INTEGER;

-- CreateTable
CREATE TABLE "ProductBlock" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'product',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductBlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductBlock_id_key" ON "ProductBlock"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Block_productBlockId_key" ON "Block"("productBlockId");

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_productBlockId_fkey" FOREIGN KEY ("productBlockId") REFERENCES "ProductBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;
