/*
  Warnings:

  - You are about to drop the column `articleId` on the `Block` table. All the data in the column will be lost.
  - You are about to drop the column `homePageId` on the `Block` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Block" DROP CONSTRAINT "Block_articleId_fkey";

-- DropForeignKey
ALTER TABLE "Block" DROP CONSTRAINT "Block_homePageId_fkey";

-- AlterTable
ALTER TABLE "Block" DROP COLUMN "articleId",
DROP COLUMN "homePageId";

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';

-- CreateTable
CREATE TABLE "_HomePageToBlocks" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ArticlesToBlocks" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_HomePageToBlocks_AB_unique" ON "_HomePageToBlocks"("A", "B");

-- CreateIndex
CREATE INDEX "_HomePageToBlocks_B_index" ON "_HomePageToBlocks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ArticlesToBlocks_AB_unique" ON "_ArticlesToBlocks"("A", "B");

-- CreateIndex
CREATE INDEX "_ArticlesToBlocks_B_index" ON "_ArticlesToBlocks"("B");

-- AddForeignKey
ALTER TABLE "_HomePageToBlocks" ADD CONSTRAINT "_HomePageToBlocks_A_fkey" FOREIGN KEY ("A") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HomePageToBlocks" ADD CONSTRAINT "_HomePageToBlocks_B_fkey" FOREIGN KEY ("B") REFERENCES "HomePage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticlesToBlocks" ADD CONSTRAINT "_ArticlesToBlocks_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticlesToBlocks" ADD CONSTRAINT "_ArticlesToBlocks_B_fkey" FOREIGN KEY ("B") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;
