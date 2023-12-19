-- AlterTable
ALTER TABLE "BlockOptions" ALTER COLUMN "columns" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "columnsMobile" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
