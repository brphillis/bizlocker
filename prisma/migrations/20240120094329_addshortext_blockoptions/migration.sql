-- AlterTable
ALTER TABLE "BlockOptions" ADD COLUMN     "shortTextFontWeight" TEXT,
ADD COLUMN     "shortTextFontWeightMobile" TEXT,
ADD COLUMN     "shortTextSize" TEXT,
ADD COLUMN     "shortTextSizeMobile" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
