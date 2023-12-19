-- AlterTable
ALTER TABLE "BlockOptions" ADD COLUMN     "imagePosition" TEXT,
ADD COLUMN     "imagePositionMobile" TEXT,
ADD COLUMN     "itemImagePositions" TEXT[],
ADD COLUMN     "itemImagePositionsMobile" TEXT[];

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
