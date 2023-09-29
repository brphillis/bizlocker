-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "rememberInformation" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
