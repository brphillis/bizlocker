-- AlterTable
ALTER TABLE "TileBlockContent" ADD COLUMN     "icon" TEXT[];

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
