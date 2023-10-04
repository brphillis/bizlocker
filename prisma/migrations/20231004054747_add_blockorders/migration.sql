-- AlterTable
ALTER TABLE "PreviewPage" ADD COLUMN     "blockOrder" TEXT[];

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
