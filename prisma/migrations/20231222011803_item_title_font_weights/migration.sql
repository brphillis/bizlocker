-- AlterTable
ALTER TABLE "BlockOptions" ADD COLUMN     "itemTitleFontWeights" TEXT[],
ADD COLUMN     "itemTitleFontWeightsMobile" TEXT[];

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
