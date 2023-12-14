-- AlterTable
ALTER TABLE "BlockOptions" ADD COLUMN     "primaryLink" TEXT,
ADD COLUMN     "secondaryLink" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
