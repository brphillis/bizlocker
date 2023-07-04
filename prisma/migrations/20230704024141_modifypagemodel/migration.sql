/*
  Warnings:

  - You are about to drop the `_PagesToPageItems` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `pageId` to the `PageItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_PagesToPageItems" DROP CONSTRAINT "_PagesToPageItems_A_fkey";

-- DropForeignKey
ALTER TABLE "_PagesToPageItems" DROP CONSTRAINT "_PagesToPageItems_B_fkey";

-- AlterTable
ALTER TABLE "PageItem" ADD COLUMN     "pageId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_PagesToPageItems";

-- AddForeignKey
ALTER TABLE "PageItem" ADD CONSTRAINT "PageItem_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
