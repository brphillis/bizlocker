-- AlterTable
ALTER TABLE "CarouselBlockContent" ADD COLUMN     "emptyItem" TEXT[];

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
