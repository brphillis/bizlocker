/*
  Warnings:

  - You are about to drop the column `itemTitleMobileSizes` on the `BlockOptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BlockOptions" DROP COLUMN "itemTitleMobileSizes",
ADD COLUMN     "itemTitleSizesMobile" TEXT[];

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
