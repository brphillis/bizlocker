-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
