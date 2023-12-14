/*
  Warnings:

  - You are about to drop the column `itemColor` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `itemSecondaryColor` on the `BlockOptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BlockOptions" DROP COLUMN "itemColor",
DROP COLUMN "itemSecondaryColor",
ADD COLUMN     "primaryColor" TEXT,
ADD COLUMN     "secondaryColor" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
