-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('created', 'cancelled', 'approved', 'processing', 'complete');

-- AlterTable
ALTER TABLE "StockTransferRequest" ADD COLUMN     "trackingNumber" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
