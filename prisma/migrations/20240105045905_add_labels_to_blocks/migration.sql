-- AlterTable
ALTER TABLE "Block" ADD COLUMN     "label" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
