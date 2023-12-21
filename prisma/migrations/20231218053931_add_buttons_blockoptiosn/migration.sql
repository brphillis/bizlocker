-- AlterTable
ALTER TABLE "BlockOptions" ADD COLUMN     "itemPrimaryButtonLinks" TEXT[],
ADD COLUMN     "itemPrimaryButtons" TEXT[],
ADD COLUMN     "itemSecondaryButtonLinks" TEXT[],
ADD COLUMN     "itemSecondaryButtons" TEXT[],
ADD COLUMN     "primaryButton" TEXT,
ADD COLUMN     "primaryButtonLink" TEXT,
ADD COLUMN     "secondaryButton" TEXT,
ADD COLUMN     "secondaryButtonLink" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
