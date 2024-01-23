-- AlterTable
ALTER TABLE "BlockOptions" ADD COLUMN     "itemMarginBottom" TEXT,
ADD COLUMN     "itemMarginBottomMobile" TEXT,
ADD COLUMN     "itemMarginLeft" TEXT,
ADD COLUMN     "itemMarginLeftMobile" TEXT,
ADD COLUMN     "itemMarginRight" TEXT,
ADD COLUMN     "itemMarginRightMobile" TEXT,
ADD COLUMN     "itemMarginTop" TEXT,
ADD COLUMN     "itemMarginTopMobile" TEXT,
ADD COLUMN     "itemPaddingBottom" TEXT,
ADD COLUMN     "itemPaddingBottomMobile" TEXT,
ADD COLUMN     "itemPaddingLeft" TEXT,
ADD COLUMN     "itemPaddingLeftMobile" TEXT,
ADD COLUMN     "itemPaddingRight" TEXT,
ADD COLUMN     "itemPaddingRightMobile" TEXT,
ADD COLUMN     "itemPaddingTop" TEXT,
ADD COLUMN     "itemPaddingTopMobile" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
