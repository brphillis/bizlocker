-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "discountPercentageHigh" SET DEFAULT 0,
ALTER COLUMN "discountPercentageHigh" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "discountPercentageLow" SET DEFAULT 0,
ALTER COLUMN "discountPercentageLow" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Promotion" ALTER COLUMN "discountPercentage" SET DEFAULT 0,
ALTER COLUMN "discountPercentage" SET DATA TYPE DOUBLE PRECISION;
