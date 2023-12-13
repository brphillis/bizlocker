-- AlterTable
ALTER TABLE "Promotion" ADD COLUMN     "metaDescription" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
