-- AlterTable
ALTER TABLE "BlockOptions" ADD COLUMN     "backgroundPatternColor" TEXT,
ADD COLUMN     "backgroundPatternName" TEXT,
ADD COLUMN     "backgroundPatternOpacity" TEXT,
ADD COLUMN     "backgroundPatternSize" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
