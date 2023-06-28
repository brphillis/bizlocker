/*
  Warnings:

  - You are about to drop the column `productDiscount` on the `Campaign` table. All the data in the column will be lost.
  - Added the required column `maxSaleRange` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minSaleRange` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "productDiscount",
ADD COLUMN     "maxSaleRange" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "minSaleRange" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "_ProductCategoryToCampaign" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BrandToCampaign" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductCategoryToCampaign_AB_unique" ON "_ProductCategoryToCampaign"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductCategoryToCampaign_B_index" ON "_ProductCategoryToCampaign"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BrandToCampaign_AB_unique" ON "_BrandToCampaign"("A", "B");

-- CreateIndex
CREATE INDEX "_BrandToCampaign_B_index" ON "_BrandToCampaign"("B");

-- AddForeignKey
ALTER TABLE "_ProductCategoryToCampaign" ADD CONSTRAINT "_ProductCategoryToCampaign_A_fkey" FOREIGN KEY ("A") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductCategoryToCampaign" ADD CONSTRAINT "_ProductCategoryToCampaign_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BrandToCampaign" ADD CONSTRAINT "_BrandToCampaign_A_fkey" FOREIGN KEY ("A") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BrandToCampaign" ADD CONSTRAINT "_BrandToCampaign_B_fkey" FOREIGN KEY ("B") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
