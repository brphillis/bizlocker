-- AlterTable
ALTER TABLE "BlockOptions" ADD COLUMN     "backgroundBrightness" TEXT,
ADD COLUMN     "backgroundBrightnessTwo" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
