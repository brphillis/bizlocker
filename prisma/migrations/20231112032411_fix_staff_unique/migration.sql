-- DropIndex
DROP INDEX "Staff_storeId_key";

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
