-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Color" ADD VALUE 'TRANSPARENTSM';
ALTER TYPE "Color" ADD VALUE 'TRANSPARENTMD';
ALTER TYPE "Color" ADD VALUE 'TRANSPARENTLG';

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
