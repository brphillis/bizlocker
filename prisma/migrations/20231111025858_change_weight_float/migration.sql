-- AlterTable
ALTER TABLE "ProductVariant" ALTER COLUMN "weight" SET DEFAULT 0.0,
ALTER COLUMN "weight" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
