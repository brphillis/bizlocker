-- AlterTable
ALTER TABLE "BlockOptions" ADD COLUMN     "numberColumns" DOUBLE PRECISION,
ADD COLUMN     "numberColumnsMobile" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
