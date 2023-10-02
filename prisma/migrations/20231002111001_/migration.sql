/*
  Warnings:

  - The `backgroundPatternSize` column on the `BlockOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `backgroundPatternSizeTwo` column on the `BlockOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "BlockOptions" DROP COLUMN "backgroundPatternSize",
ADD COLUMN     "backgroundPatternSize" INTEGER,
DROP COLUMN "backgroundPatternSizeTwo",
ADD COLUMN     "backgroundPatternSizeTwo" INTEGER;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
