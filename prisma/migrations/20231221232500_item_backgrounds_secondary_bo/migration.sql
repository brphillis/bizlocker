-- AlterTable
ALTER TABLE "BlockOptions" ADD COLUMN     "itemBackgroundBrightnessesSecondary" DOUBLE PRECISION[],
ADD COLUMN     "itemBackgroundDisplaysSecondary" TEXT[],
ADD COLUMN     "itemBackgroundPatternColorsSecondary" TEXT[],
ADD COLUMN     "itemBackgroundPatternNamesSecondary" TEXT[],
ADD COLUMN     "itemBackgroundPatternOpacitiesSecondary" DOUBLE PRECISION[],
ADD COLUMN     "itemBackgroundPatternSizesSecondary" INTEGER[],
ADD COLUMN     "itemBackgroundWidthsSecondary" TEXT[];

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
