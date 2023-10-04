/*
  Warnings:

  - You are about to drop the column `webPageId` on the `Block` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Block" DROP CONSTRAINT "Block_webPageId_fkey";

-- AlterTable
ALTER TABLE "Block" DROP COLUMN "webPageId";

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';

-- CreateTable
CREATE TABLE "_WebPagesToBlocks" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_WebPagesToBlocks_AB_unique" ON "_WebPagesToBlocks"("A", "B");

-- CreateIndex
CREATE INDEX "_WebPagesToBlocks_B_index" ON "_WebPagesToBlocks"("B");

-- AddForeignKey
ALTER TABLE "_WebPagesToBlocks" ADD CONSTRAINT "_WebPagesToBlocks_A_fkey" FOREIGN KEY ("A") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WebPagesToBlocks" ADD CONSTRAINT "_WebPagesToBlocks_B_fkey" FOREIGN KEY ("B") REFERENCES "WebPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
