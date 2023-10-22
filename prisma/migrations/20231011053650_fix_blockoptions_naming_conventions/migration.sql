/*
  Warnings:

  - You are about to drop the column `titleFive` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `titleFour` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `titleOne` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `titleSix` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `titleThree` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `titleTwo` on the `BlockOptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BlockOptions" DROP COLUMN "titleFive",
DROP COLUMN "titleFour",
DROP COLUMN "titleOne",
DROP COLUMN "titleSix",
DROP COLUMN "titleThree",
DROP COLUMN "titleTwo",
ADD COLUMN     "title1" TEXT,
ADD COLUMN     "title2" TEXT,
ADD COLUMN     "title3" TEXT,
ADD COLUMN     "title4" TEXT,
ADD COLUMN     "title5" TEXT,
ADD COLUMN     "title6" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
