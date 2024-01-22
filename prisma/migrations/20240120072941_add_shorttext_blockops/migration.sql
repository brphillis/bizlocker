-- AlterTable
ALTER TABLE "BlockOptions" ADD COLUMN     "itemGap" TEXT[],
ADD COLUMN     "itemShortTextFontWeights" TEXT[],
ADD COLUMN     "itemShortTextFontWeightsMobile" TEXT[];

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
