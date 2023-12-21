/*
  Warnings:

  - You are about to drop the column `itemPrimaryButtonBorderColors` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `itemPrimaryButtonColors` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `itemPrimaryButtonLabelColors` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `itemPrimaryButtonLabels` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `itemPrimaryButtonLinks` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `itemPrimaryButtons` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `itemSecondaryBackgroundColors` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `itemSecondaryButtonBorderColors` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `itemSecondaryButtonColors` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `itemSecondaryButtonLabelColors` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `itemSecondaryButtonLabels` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `itemSecondaryButtonLinks` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `itemSecondaryButtons` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `itemSecondaryColors` on the `BlockOptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BlockOptions" DROP COLUMN "itemPrimaryButtonBorderColors",
DROP COLUMN "itemPrimaryButtonColors",
DROP COLUMN "itemPrimaryButtonLabelColors",
DROP COLUMN "itemPrimaryButtonLabels",
DROP COLUMN "itemPrimaryButtonLinks",
DROP COLUMN "itemPrimaryButtons",
DROP COLUMN "itemSecondaryBackgroundColors",
DROP COLUMN "itemSecondaryButtonBorderColors",
DROP COLUMN "itemSecondaryButtonColors",
DROP COLUMN "itemSecondaryButtonLabelColors",
DROP COLUMN "itemSecondaryButtonLabels",
DROP COLUMN "itemSecondaryButtonLinks",
DROP COLUMN "itemSecondaryButtons",
DROP COLUMN "itemSecondaryColors",
ADD COLUMN     "itemBackgroundColorsSecondary" TEXT[],
ADD COLUMN     "itemButtonBorderColorsPrimary" TEXT[],
ADD COLUMN     "itemButtonBorderColorsSecondary" TEXT[],
ADD COLUMN     "itemButtonColorsPrimary" TEXT[],
ADD COLUMN     "itemButtonColorsSecondary" TEXT[],
ADD COLUMN     "itemButtonLabelColorsPrimary" TEXT[],
ADD COLUMN     "itemButtonLabelColorsSecondary" TEXT[],
ADD COLUMN     "itemButtonLabelsPrimary" TEXT[],
ADD COLUMN     "itemButtonLabelsSecondary" TEXT[],
ADD COLUMN     "itemButtonLinksPrimary" TEXT[],
ADD COLUMN     "itemButtonLinksSecondary" TEXT[],
ADD COLUMN     "itemButtonsPrimary" TEXT[],
ADD COLUMN     "itemButtonsSecondary" TEXT[],
ADD COLUMN     "itemColorsSecondary" TEXT[];

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
