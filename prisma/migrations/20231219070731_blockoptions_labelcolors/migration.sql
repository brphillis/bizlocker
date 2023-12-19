/*
  Warnings:

  - You are about to drop the column `primaryButtonTextColor` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryButtonTextColor` on the `BlockOptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BlockOptions" DROP COLUMN "primaryButtonTextColor",
DROP COLUMN "secondaryButtonTextColor",
ADD COLUMN     "primaryButtonLabelColor" TEXT,
ADD COLUMN     "secondaryButtonLabelColor" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
