/*
  Warnings:

  - You are about to drop the column `itemBackgroundColors` on the `BlockOptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BlockOptions" DROP COLUMN "itemBackgroundColors",
ADD COLUMN     "itemBackgroundBrightnessesPrimary" DOUBLE PRECISION[],
ADD COLUMN     "itemBackgroundColorsPrimary" TEXT[],
ADD COLUMN     "itemBackgroundDisplaysPrimary" TEXT[],
ADD COLUMN     "itemBackgroundPatternColorsPrimary" TEXT[],
ADD COLUMN     "itemBackgroundPatternNamesPrimary" TEXT[],
ADD COLUMN     "itemBackgroundPatternOpacitiesPrimary" DOUBLE PRECISION[],
ADD COLUMN     "itemBackgroundPatternSizesPrimary" INTEGER[],
ADD COLUMN     "itemBackgroundWidthsPrimary" TEXT[];

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
