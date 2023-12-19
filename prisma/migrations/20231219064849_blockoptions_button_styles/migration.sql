-- AlterTable
ALTER TABLE "BlockOptions" ADD COLUMN     "itemPrimaryButtonBorderColors" TEXT[],
ADD COLUMN     "itemPrimaryButtonColors" TEXT[],
ADD COLUMN     "itemPrimaryButtonLabelColors" TEXT[],
ADD COLUMN     "itemPrimaryButtonLabels" TEXT[],
ADD COLUMN     "itemSecondaryButtonBorderColors" TEXT[],
ADD COLUMN     "itemSecondaryButtonColors" TEXT[],
ADD COLUMN     "itemSecondaryButtonLabelColors" TEXT[],
ADD COLUMN     "itemSecondaryButtonLabels" TEXT[],
ADD COLUMN     "primaryButtonBorderColor" TEXT,
ADD COLUMN     "primaryButtonColor" TEXT,
ADD COLUMN     "primaryButtonLabel" TEXT,
ADD COLUMN     "primaryButtonTextColor" TEXT,
ADD COLUMN     "secondaryButtonBorderColor" TEXT,
ADD COLUMN     "secondaryButtonColor" TEXT,
ADD COLUMN     "secondaryButtonLabel" TEXT,
ADD COLUMN     "secondaryButtonTextColor" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
