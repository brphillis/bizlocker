-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "urlSegment" TEXT;

-- AlterTable
ALTER TABLE "PreviewPage" ADD COLUMN     "urlSegment" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';

-- AlterTable
ALTER TABLE "WebPage" ADD COLUMN     "urlSegment" TEXT;
