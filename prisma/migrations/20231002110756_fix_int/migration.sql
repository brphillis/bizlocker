/*
  Warnings:

  - The `backgroundPatternOpacity` column on the `BlockOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `backgroundPatternOpacityTwo` column on the `BlockOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `backgroundBrightness` column on the `BlockOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `backgroundBrightnessTwo` column on the `BlockOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "BlockOptions" DROP COLUMN "backgroundPatternOpacity",
ADD COLUMN     "backgroundPatternOpacity" INTEGER,
DROP COLUMN "backgroundPatternOpacityTwo",
ADD COLUMN     "backgroundPatternOpacityTwo" INTEGER,
DROP COLUMN "backgroundBrightness",
ADD COLUMN     "backgroundBrightness" INTEGER,
DROP COLUMN "backgroundBrightnessTwo",
ADD COLUMN     "backgroundBrightnessTwo" INTEGER;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
