-- AlterTable
ALTER TABLE "StockTransferRequest" ALTER COLUMN "status" SET DEFAULT 'created';

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
