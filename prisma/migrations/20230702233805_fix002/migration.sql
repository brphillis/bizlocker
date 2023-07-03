/*
  Warnings:

  - You are about to drop the column `homePageId` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `homePageBannerId` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `homePageTileRowId` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `campaignBannerId` on the `HomePage` table. All the data in the column will be lost.
  - You are about to drop the column `campaignTileRowId` on the `HomePage` table. All the data in the column will be lost.
  - You are about to drop the column `promotionBannerId` on the `HomePage` table. All the data in the column will be lost.
  - You are about to drop the column `promotionTilesId` on the `HomePage` table. All the data in the column will be lost.
  - You are about to drop the column `DiscountPercentageHigh` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `DiscountPercentageLow` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `homePageId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `homePageNewProductsId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `homePagePromotionBannerId` on the `Promotion` table. All the data in the column will be lost.
  - You are about to drop the column `homePagePromotionTilesId` on the `Promotion` table. All the data in the column will be lost.
  - Added the required column `campaignBanner` to the `HomePage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `campaignTileRow` to the `HomePage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `promotionBanner` to the `HomePage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `promotionTiles` to the `HomePage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_homePageId_fkey";

-- DropForeignKey
ALTER TABLE "Campaign" DROP CONSTRAINT "Campaign_homePageBannerId_fkey";

-- DropForeignKey
ALTER TABLE "Campaign" DROP CONSTRAINT "Campaign_homePageTileRowId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_homePageId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_homePageNewProductsId_fkey";

-- DropForeignKey
ALTER TABLE "Promotion" DROP CONSTRAINT "Promotion_homePagePromotionBannerId_fkey";

-- DropForeignKey
ALTER TABLE "Promotion" DROP CONSTRAINT "Promotion_homePagePromotionTilesId_fkey";

-- DropIndex
DROP INDEX "Campaign_homePageBannerId_key";

-- DropIndex
DROP INDEX "Campaign_homePageTileRowId_key";

-- DropIndex
DROP INDEX "HomePage_id_key";

-- DropIndex
DROP INDEX "Promotion_homePagePromotionBannerId_key";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "homePageId";

-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "homePageBannerId",
DROP COLUMN "homePageTileRowId";

-- AlterTable
ALTER TABLE "HomePage" DROP COLUMN "campaignBannerId",
DROP COLUMN "campaignTileRowId",
DROP COLUMN "promotionBannerId",
DROP COLUMN "promotionTilesId",
ADD COLUMN     "campaignBanner" TEXT NOT NULL,
ADD COLUMN     "campaignTileRow" TEXT NOT NULL,
ADD COLUMN     "promotionBanner" TEXT NOT NULL,
ADD COLUMN     "promotionTiles" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "DiscountPercentageHigh",
DROP COLUMN "DiscountPercentageLow",
DROP COLUMN "homePageId",
DROP COLUMN "homePageNewProductsId",
ADD COLUMN     "discountPercentageHigh" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "discountPercentageLow" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Promotion" DROP COLUMN "homePagePromotionBannerId",
DROP COLUMN "homePagePromotionTilesId";
