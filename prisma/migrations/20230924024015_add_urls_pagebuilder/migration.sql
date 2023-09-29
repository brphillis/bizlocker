/*
  Warnings:

  - You are about to drop the column `primaryLink` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryLink` on the `BlockOptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BlockOptions" DROP COLUMN "primaryLink",
DROP COLUMN "secondaryLink",
ADD COLUMN     "linkFive" TEXT,
ADD COLUMN     "linkFour" TEXT,
ADD COLUMN     "linkOne" TEXT,
ADD COLUMN     "linkSix" TEXT,
ADD COLUMN     "linkThree" TEXT,
ADD COLUMN     "linkTwo" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
