-- AlterEnum
ALTER TYPE "Color" ADD VALUE 'TRANSPARENT';

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
