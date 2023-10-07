-- AlterTable
ALTER TABLE "PreviewPage" ADD COLUMN     "description" TEXT NOT NULL DEFAULT 'Page Description',
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'Page Title';

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
