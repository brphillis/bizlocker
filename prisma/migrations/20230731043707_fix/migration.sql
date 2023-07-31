-- AlterTable
ALTER TABLE "EmailVerifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
