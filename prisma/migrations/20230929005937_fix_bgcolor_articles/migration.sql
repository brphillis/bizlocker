/*
  Warnings:

  - You are about to drop the column `backgroundColor` on the `ArticleBlock` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "backgroundColor" TEXT;

-- AlterTable
ALTER TABLE "ArticleBlock" DROP COLUMN "backgroundColor";

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
