-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "displayInNavigation" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "index" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ProductCategory" ADD COLUMN     "displayInNavigation" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "index" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ProductSubCategory" ADD COLUMN     "displayInNavigation" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "index" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
