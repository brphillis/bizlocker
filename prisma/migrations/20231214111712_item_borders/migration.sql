/*
  Warnings:

  - The `itemBorderColor` column on the `BlockOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `itemBorderDisplay` column on the `BlockOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `itemBorderRadius` column on the `BlockOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `itemBorderSize` column on the `BlockOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "BlockOptions" DROP COLUMN "itemBorderColor",
ADD COLUMN     "itemBorderColor" TEXT[],
DROP COLUMN "itemBorderDisplay",
ADD COLUMN     "itemBorderDisplay" TEXT[],
DROP COLUMN "itemBorderRadius",
ADD COLUMN     "itemBorderRadius" TEXT[],
DROP COLUMN "itemBorderSize",
ADD COLUMN     "itemBorderSize" TEXT[];

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
