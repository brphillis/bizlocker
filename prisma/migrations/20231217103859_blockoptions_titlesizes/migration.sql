-- AlterTable
ALTER TABLE "BlockOptions" ADD COLUMN     "itemTitleMobileSizes" TEXT[],
ADD COLUMN     "itemTitleSizes" TEXT[],
ADD COLUMN     "titleSizeMobile" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
