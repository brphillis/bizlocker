-- AlterTable
ALTER TABLE "BlockOptions" ADD COLUMN     "itemLinks" TEXT[];

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
