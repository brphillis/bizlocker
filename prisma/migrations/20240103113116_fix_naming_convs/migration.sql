/*
  Warnings:

  - You are about to drop the column `campaignId` on the `BlockContent` table. All the data in the column will be lost.
  - You are about to drop the column `emptyItems` on the `BlockContent` table. All the data in the column will be lost.
  - You are about to drop the column `genders` on the `BlockContent` table. All the data in the column will be lost.
  - You are about to drop the column `icons` on the `BlockContent` table. All the data in the column will be lost.
  - You are about to drop the column `promotionId` on the `BlockContent` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BlockContent" DROP CONSTRAINT "BlockContent_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "BlockContent" DROP CONSTRAINT "BlockContent_promotionId_fkey";

-- AlterTable
ALTER TABLE "BlockContent" DROP COLUMN "campaignId",
DROP COLUMN "emptyItems",
DROP COLUMN "genders",
DROP COLUMN "icons",
DROP COLUMN "promotionId",
ADD COLUMN     "emptyItem" TEXT[],
ADD COLUMN     "gender" "Gender"[],
ADD COLUMN     "icon" TEXT[];

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';

-- CreateTable
CREATE TABLE "_BlockContentToCampaigns" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BlockContentToPromotions" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BlockContentToCampaigns_AB_unique" ON "_BlockContentToCampaigns"("A", "B");

-- CreateIndex
CREATE INDEX "_BlockContentToCampaigns_B_index" ON "_BlockContentToCampaigns"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BlockContentToPromotions_AB_unique" ON "_BlockContentToPromotions"("A", "B");

-- CreateIndex
CREATE INDEX "_BlockContentToPromotions_B_index" ON "_BlockContentToPromotions"("B");

-- AddForeignKey
ALTER TABLE "_BlockContentToCampaigns" ADD CONSTRAINT "_BlockContentToCampaigns_A_fkey" FOREIGN KEY ("A") REFERENCES "BlockContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockContentToCampaigns" ADD CONSTRAINT "_BlockContentToCampaigns_B_fkey" FOREIGN KEY ("B") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockContentToPromotions" ADD CONSTRAINT "_BlockContentToPromotions_A_fkey" FOREIGN KEY ("A") REFERENCES "BlockContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockContentToPromotions" ADD CONSTRAINT "_BlockContentToPromotions_B_fkey" FOREIGN KEY ("B") REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
