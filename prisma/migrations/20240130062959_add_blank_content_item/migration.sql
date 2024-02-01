/*
  Warnings:

  - You are about to drop the column `emptyItem` on the `BlockContent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BlockContent" DROP COLUMN "emptyItem",
ADD COLUMN     "other" TEXT[];

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
