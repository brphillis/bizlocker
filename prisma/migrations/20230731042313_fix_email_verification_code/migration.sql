-- AlterTable
ALTER TABLE "EmailVerifier" ALTER COLUMN "code" DROP NOT NULL,
ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
