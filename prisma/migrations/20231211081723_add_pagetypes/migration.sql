-- CreateEnum
CREATE TYPE "PageType" AS ENUM ('homePage', 'article', 'webPage', 'previewPage');

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
