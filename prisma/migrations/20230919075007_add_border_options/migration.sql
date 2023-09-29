-- AlterTable
ALTER TABLE "BlockOptions" ADD COLUMN     "borderColor" "Color",
ADD COLUMN     "borderRadius" TEXT,
ADD COLUMN     "borderSize" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
