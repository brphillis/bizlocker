/*
  Warnings:

  - The `itemMarginBottom` column on the `BlockOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `itemMarginBottomMobile` column on the `BlockOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `itemMarginLeft` column on the `BlockOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `itemMarginLeftMobile` column on the `BlockOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `itemMarginRight` column on the `BlockOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `itemMarginRightMobile` column on the `BlockOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `itemMarginTop` column on the `BlockOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `itemMarginTopMobile` column on the `BlockOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `itemPaddingBottom` column on the `BlockOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `itemPaddingBottomMobile` column on the `BlockOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `itemPaddingLeft` column on the `BlockOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `itemPaddingLeftMobile` column on the `BlockOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `itemPaddingRight` column on the `BlockOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `itemPaddingRightMobile` column on the `BlockOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `itemPaddingTop` column on the `BlockOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `itemPaddingTopMobile` column on the `BlockOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "BlockOptions" DROP COLUMN "itemMarginBottom",
ADD COLUMN     "itemMarginBottom" TEXT[],
DROP COLUMN "itemMarginBottomMobile",
ADD COLUMN     "itemMarginBottomMobile" TEXT[],
DROP COLUMN "itemMarginLeft",
ADD COLUMN     "itemMarginLeft" TEXT[],
DROP COLUMN "itemMarginLeftMobile",
ADD COLUMN     "itemMarginLeftMobile" TEXT[],
DROP COLUMN "itemMarginRight",
ADD COLUMN     "itemMarginRight" TEXT[],
DROP COLUMN "itemMarginRightMobile",
ADD COLUMN     "itemMarginRightMobile" TEXT[],
DROP COLUMN "itemMarginTop",
ADD COLUMN     "itemMarginTop" TEXT[],
DROP COLUMN "itemMarginTopMobile",
ADD COLUMN     "itemMarginTopMobile" TEXT[],
DROP COLUMN "itemPaddingBottom",
ADD COLUMN     "itemPaddingBottom" TEXT[],
DROP COLUMN "itemPaddingBottomMobile",
ADD COLUMN     "itemPaddingBottomMobile" TEXT[],
DROP COLUMN "itemPaddingLeft",
ADD COLUMN     "itemPaddingLeft" TEXT[],
DROP COLUMN "itemPaddingLeftMobile",
ADD COLUMN     "itemPaddingLeftMobile" TEXT[],
DROP COLUMN "itemPaddingRight",
ADD COLUMN     "itemPaddingRight" TEXT[],
DROP COLUMN "itemPaddingRightMobile",
ADD COLUMN     "itemPaddingRightMobile" TEXT[],
DROP COLUMN "itemPaddingTop",
ADD COLUMN     "itemPaddingTop" TEXT[],
DROP COLUMN "itemPaddingTopMobile",
ADD COLUMN     "itemPaddingTopMobile" TEXT[];

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
