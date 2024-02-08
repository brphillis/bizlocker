-- AlterTable
ALTER TABLE "BlockOptions" ADD COLUMN     "itemShortTextShadows" TEXT[],
ADD COLUMN     "itemTitleShadows" TEXT[];

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
