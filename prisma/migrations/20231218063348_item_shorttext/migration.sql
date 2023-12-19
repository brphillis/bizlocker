-- AlterTable
ALTER TABLE "BlockOptions" ADD COLUMN     "itemShortText" TEXT[],
ADD COLUMN     "itemShortTextColors" TEXT[],
ADD COLUMN     "itemShortTextSizes" TEXT[],
ADD COLUMN     "itemShortTextSizesMobile" TEXT[];

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
