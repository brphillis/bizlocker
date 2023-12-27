/*
  Warnings:

  - You are about to drop the column `titleWeight` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `titleWeightMobile` on the `BlockOptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BlockOptions" DROP COLUMN "titleWeight",
DROP COLUMN "titleWeightMobile",
ADD COLUMN     "titleFontWeight" TEXT,
ADD COLUMN     "titleFontWeightMobile" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
