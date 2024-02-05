-- AlterTable
ALTER TABLE "BlockOptions" ALTER COLUMN "columns" SET DATA TYPE TEXT,
ALTER COLUMN "columnsMobile" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
