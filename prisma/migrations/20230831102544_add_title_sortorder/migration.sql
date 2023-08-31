-- AlterEnum
ALTER TYPE "SortBy" ADD VALUE 'title';

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
