-- AlterTable
ALTER TABLE "BlockOptions" ALTER COLUMN "backgroundPatternOpacity" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "backgroundBrightness" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "backgroundBrightnessSecondary" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "backgroundPatternOpacitySecondary" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
