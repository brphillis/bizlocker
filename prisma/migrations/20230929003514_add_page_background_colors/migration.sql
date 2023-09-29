-- AlterTable
ALTER TABLE "ArticleBlock" ADD COLUMN     "backgroundColor" TEXT;

-- AlterTable
ALTER TABLE "HomePage" ADD COLUMN     "backgroundColor" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';

-- AlterTable
ALTER TABLE "WebPage" ADD COLUMN     "backgroundColor" TEXT;
