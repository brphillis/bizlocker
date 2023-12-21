/*
  Warnings:

  - You are about to drop the column `primaryButton` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `primaryButtonBorderColor` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `primaryButtonColor` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `primaryButtonLabel` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `primaryButtonLabelColor` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `primaryButtonLink` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `primaryColor` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `primaryLink` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryButton` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryButtonBorderColor` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryButtonColor` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryButtonLabel` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryButtonLabelColor` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryButtonLink` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryColor` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryLink` on the `BlockOptions` table. All the data in the column will be lost.
  - The `autoplay` column on the `BlockOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `speed` column on the `BlockOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "BlockOptions" DROP COLUMN "primaryButton",
DROP COLUMN "primaryButtonBorderColor",
DROP COLUMN "primaryButtonColor",
DROP COLUMN "primaryButtonLabel",
DROP COLUMN "primaryButtonLabelColor",
DROP COLUMN "primaryButtonLink",
DROP COLUMN "primaryColor",
DROP COLUMN "primaryLink",
DROP COLUMN "secondaryButton",
DROP COLUMN "secondaryButtonBorderColor",
DROP COLUMN "secondaryButtonColor",
DROP COLUMN "secondaryButtonLabel",
DROP COLUMN "secondaryButtonLabelColor",
DROP COLUMN "secondaryButtonLink",
DROP COLUMN "secondaryColor",
DROP COLUMN "secondaryLink",
ADD COLUMN     "buttonAlign" TEXT,
ADD COLUMN     "buttonBorderColorPrimary" TEXT,
ADD COLUMN     "buttonBorderColorSecondary" TEXT,
ADD COLUMN     "buttonColorPrimary" TEXT,
ADD COLUMN     "buttonColorSecondary" TEXT,
ADD COLUMN     "buttonLabelColorPrimary" TEXT,
ADD COLUMN     "buttonLabelColorSecondary" TEXT,
ADD COLUMN     "buttonLabelPrimary" TEXT,
ADD COLUMN     "buttonLabelSecondary" TEXT,
ADD COLUMN     "buttonLinkPrimary" TEXT,
ADD COLUMN     "buttonLinkSecondary" TEXT,
ADD COLUMN     "buttonPrimary" TEXT,
ADD COLUMN     "buttonSecondary" TEXT,
ADD COLUMN     "colorPrimary" TEXT,
ADD COLUMN     "colorSecondary" TEXT,
ADD COLUMN     "height" TEXT,
ADD COLUMN     "heightMobile" TEXT,
ADD COLUMN     "itemButtonAlign" TEXT[],
ADD COLUMN     "linkPrimary" TEXT,
ADD COLUMN     "linkSecondary" TEXT,
ADD COLUMN     "width" TEXT,
ADD COLUMN     "widthMobile" TEXT,
DROP COLUMN "autoplay",
ADD COLUMN     "autoplay" BOOLEAN,
DROP COLUMN "speed",
ADD COLUMN     "speed" INTEGER;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
