/*
  Warnings:

  - You are about to drop the column `navigationStyle` on the `SiteSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SiteSettings" DROP COLUMN "navigationStyle",
ADD COLUMN     "navigationStyleDesktop" TEXT NOT NULL DEFAULT 'productBasic',
ADD COLUMN     "navigationStyleMobile" TEXT NOT NULL DEFAULT 'productBasic';

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
