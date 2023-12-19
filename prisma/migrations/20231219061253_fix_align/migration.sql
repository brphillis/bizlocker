/*
  Warnings:

  - You are about to drop the column `contentAlign` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `contentAlignMobile` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `itemContentAlign` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `itemContentAlignMobile` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `itemJustifyAlign` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `itemJustifyAlignMobile` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `justifyAlign` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `justifyAlignMobile` on the `BlockOptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BlockOptions" DROP COLUMN "contentAlign",
DROP COLUMN "contentAlignMobile",
DROP COLUMN "itemContentAlign",
DROP COLUMN "itemContentAlignMobile",
DROP COLUMN "itemJustifyAlign",
DROP COLUMN "itemJustifyAlignMobile",
DROP COLUMN "justifyAlign",
DROP COLUMN "justifyAlignMobile",
ADD COLUMN     "align" TEXT,
ADD COLUMN     "alignMobile" TEXT,
ADD COLUMN     "itemAlign" TEXT[],
ADD COLUMN     "itemAlignMobile" TEXT[],
ADD COLUMN     "itemJustify" TEXT[],
ADD COLUMN     "itemJustifyMobile" TEXT[],
ADD COLUMN     "justify" TEXT,
ADD COLUMN     "justifyMobile" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
