-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "description" TEXT NOT NULL DEFAULT 'Article Description';

-- AlterTable
ALTER TABLE "HomePage" ADD COLUMN     "description" TEXT NOT NULL DEFAULT 'HomePage Description';

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';

-- AlterTable
ALTER TABLE "WebPage" ADD COLUMN     "description" TEXT NOT NULL DEFAULT 'Page Description';
