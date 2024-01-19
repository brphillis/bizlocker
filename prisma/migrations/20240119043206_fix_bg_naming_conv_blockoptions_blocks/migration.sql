/*
  Warnings:

  - You are about to drop the column `backgroundBrightness` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `backgroundColor` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `backgroundDisplay` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `backgroundPatternColor` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `backgroundPatternName` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `backgroundPatternOpacity` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `backgroundPatternSize` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `backgroundWidth` on the `BlockOptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BlockOptions" DROP COLUMN "backgroundBrightness",
DROP COLUMN "backgroundColor",
DROP COLUMN "backgroundDisplay",
DROP COLUMN "backgroundPatternColor",
DROP COLUMN "backgroundPatternName",
DROP COLUMN "backgroundPatternOpacity",
DROP COLUMN "backgroundPatternSize",
DROP COLUMN "backgroundWidth",
ADD COLUMN     "backgroundBrightnessPrimary" DOUBLE PRECISION,
ADD COLUMN     "backgroundColorPrimary" TEXT,
ADD COLUMN     "backgroundDisplayPrimary" TEXT,
ADD COLUMN     "backgroundDisplaySecondary" TEXT,
ADD COLUMN     "backgroundPatternColorPrimary" TEXT,
ADD COLUMN     "backgroundPatternNamePrimary" TEXT,
ADD COLUMN     "backgroundPatternOpacityPrimary" DOUBLE PRECISION,
ADD COLUMN     "backgroundPatternSizePrimary" INTEGER,
ADD COLUMN     "backgroundWidthPrimary" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
