-- AlterTable
ALTER TABLE "BlockOptions" ADD COLUMN     "contentAlign" TEXT,
ADD COLUMN     "contentAlignMobile" TEXT,
ADD COLUMN     "itemContentAligns" TEXT[],
ADD COLUMN     "itemContentAlignsMobile" TEXT[],
ADD COLUMN     "itemJustifyAligns" TEXT[],
ADD COLUMN     "itemJustifyAlignsMobile" TEXT[],
ADD COLUMN     "justifyAlign" TEXT,
ADD COLUMN     "justifyAlignMobile" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
