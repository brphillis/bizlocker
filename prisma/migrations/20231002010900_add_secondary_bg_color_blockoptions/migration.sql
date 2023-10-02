-- AlterTable
ALTER TABLE "BlockOptions" ADD COLUMN     "backgroundColorTwo" "Color",
ADD COLUMN     "backgroundWidthTwo" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
