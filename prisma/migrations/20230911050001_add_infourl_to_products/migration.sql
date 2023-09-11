-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "infoURL" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
