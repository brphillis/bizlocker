/*
  Warnings:

  - You are about to drop the column `itemBorderColor` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `itemBorderDisplay` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `itemBorderSize` on the `BlockOptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BlockOptions" DROP COLUMN "itemBorderColor",
DROP COLUMN "itemBorderDisplay",
DROP COLUMN "itemBorderSize",
ADD COLUMN     "itemBorderColors" TEXT[],
ADD COLUMN     "itemBorderDisplays" TEXT[],
ADD COLUMN     "itemBorderSizes" TEXT[];

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
