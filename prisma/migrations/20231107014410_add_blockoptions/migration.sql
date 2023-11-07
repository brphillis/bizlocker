-- AlterTable
ALTER TABLE "BlockOptions" ADD COLUMN     "itemBorderColor" TEXT,
ADD COLUMN     "itemBorderDisplay" TEXT,
ADD COLUMN     "itemBorderRadius" TEXT,
ADD COLUMN     "itemBorderSize" TEXT,
ADD COLUMN     "itemColor" TEXT,
ADD COLUMN     "itemSecondaryColor" TEXT,
ADD COLUMN     "titleAlign" TEXT,
ADD COLUMN     "titleSize" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
