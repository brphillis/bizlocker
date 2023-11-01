-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shippingMethod" TEXT,
ADD COLUMN     "shippingPrice" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
