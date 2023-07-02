-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "DiscountPercentageHigh" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "DiscountPercentageLow" INTEGER NOT NULL DEFAULT 0;
