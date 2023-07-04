/*
  Warnings:

  - You are about to drop the column `latestArticles` on the `PageItem` table. All the data in the column will be lost.
  - You are about to drop the column `latestProducts` on the `PageItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PageItem" DROP COLUMN "latestArticles",
DROP COLUMN "latestProducts";
