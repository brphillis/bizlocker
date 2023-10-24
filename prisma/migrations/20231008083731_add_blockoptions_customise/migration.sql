/*
  Warnings:

  - You are about to drop the column `backgroundBrightnessTwo` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `backgroundColorTwo` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `backgroundPatternColorTwo` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `backgroundPatternNameTwo` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `backgroundPatternOpacityTwo` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `backgroundPatternSizeTwo` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `backgroundWidthTwo` on the `BlockOptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BlockOptions" DROP COLUMN "backgroundBrightnessTwo",
DROP COLUMN "backgroundColorTwo",
DROP COLUMN "backgroundPatternColorTwo",
DROP COLUMN "backgroundPatternNameTwo",
DROP COLUMN "backgroundPatternOpacityTwo",
DROP COLUMN "backgroundPatternSizeTwo",
DROP COLUMN "backgroundWidthTwo",
ADD COLUMN     "backgroundBrightnessSecondary" INTEGER,
ADD COLUMN     "backgroundColorSecondary" "Color",
ADD COLUMN     "backgroundPatternColorSecondary" TEXT,
ADD COLUMN     "backgroundPatternNameSecondary" TEXT,
ADD COLUMN     "backgroundPatternOpacitySecondary" INTEGER,
ADD COLUMN     "backgroundPatternSizeSecondary" INTEGER,
ADD COLUMN     "backgroundWidthSecondary" TEXT,
ADD COLUMN     "colorSecondaryFive" TEXT,
ADD COLUMN     "colorSecondaryFour" TEXT,
ADD COLUMN     "colorSecondaryOne" TEXT,
ADD COLUMN     "colorSecondarySix" TEXT,
ADD COLUMN     "colorSecondaryThree" TEXT,
ADD COLUMN     "colorSecondaryTwo" TEXT,
ADD COLUMN     "titleFive" TEXT,
ADD COLUMN     "titleFour" TEXT,
ADD COLUMN     "titleOne" TEXT,
ADD COLUMN     "titleSix" TEXT,
ADD COLUMN     "titleThree" TEXT,
ADD COLUMN     "titleTwo" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
