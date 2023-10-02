-- AlterTable
ALTER TABLE "BlockOptions" ADD COLUMN     "colorFive" TEXT,
ADD COLUMN     "colorFour" TEXT,
ADD COLUMN     "colorOne" TEXT,
ADD COLUMN     "colorSix" TEXT,
ADD COLUMN     "colorThree" TEXT,
ADD COLUMN     "colorTwo" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
