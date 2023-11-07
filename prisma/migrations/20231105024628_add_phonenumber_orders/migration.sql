-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "phoneNumber" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
