/*
  Warnings:

  - The `backgroundColor` column on the `BlockOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `shortTextColor` column on the `BlockOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `titleColor` column on the `BlockOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `borderColor` column on the `BlockOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `backgroundColorSecondary` column on the `BlockOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "BlockOptions" DROP COLUMN "backgroundColor",
ADD COLUMN     "backgroundColor" TEXT,
DROP COLUMN "shortTextColor",
ADD COLUMN     "shortTextColor" TEXT,
DROP COLUMN "titleColor",
ADD COLUMN     "titleColor" TEXT,
DROP COLUMN "borderColor",
ADD COLUMN     "borderColor" TEXT,
DROP COLUMN "backgroundColorSecondary",
ADD COLUMN     "backgroundColorSecondary" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
