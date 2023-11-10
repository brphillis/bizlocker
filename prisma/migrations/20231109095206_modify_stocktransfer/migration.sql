/*
  Warnings:

  - Changed the type of `status` on the `StockTransferRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "StockTransferRequest" DROP COLUMN "status",
ADD COLUMN     "status" "ApprovalStatus" NOT NULL;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
