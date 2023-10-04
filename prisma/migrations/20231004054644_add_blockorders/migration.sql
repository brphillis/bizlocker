-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "blockOrder" TEXT[];

-- AlterTable
ALTER TABLE "HomePage" ADD COLUMN     "blockOrder" TEXT[];

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';

-- AlterTable
ALTER TABLE "WebPage" ADD COLUMN     "blockOrder" TEXT[];
