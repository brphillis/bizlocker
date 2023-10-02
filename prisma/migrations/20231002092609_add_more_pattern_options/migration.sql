-- AlterTable
ALTER TABLE "BlockOptions" ADD COLUMN     "backgroundPatternColorTwo" TEXT,
ADD COLUMN     "backgroundPatternNameTwo" TEXT,
ADD COLUMN     "backgroundPatternOpacityTwo" TEXT,
ADD COLUMN     "backgroundPatternSizeTwo" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
