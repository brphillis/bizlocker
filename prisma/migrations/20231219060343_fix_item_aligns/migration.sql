/*
  Warnings:

  - You are about to drop the column `itemContentAligns` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `itemContentAlignsMobile` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `itemJustifyAligns` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `itemJustifyAlignsMobile` on the `BlockOptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BlockOptions" DROP COLUMN "itemContentAligns",
DROP COLUMN "itemContentAlignsMobile",
DROP COLUMN "itemJustifyAligns",
DROP COLUMN "itemJustifyAlignsMobile",
ADD COLUMN     "itemContentAlign" TEXT[],
ADD COLUMN     "itemContentAlignMobile" TEXT[],
ADD COLUMN     "itemJustifyAlign" TEXT[],
ADD COLUMN     "itemJustifyAlignMobile" TEXT[];

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
