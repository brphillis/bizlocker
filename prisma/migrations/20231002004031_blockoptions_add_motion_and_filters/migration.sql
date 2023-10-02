-- AlterTable
ALTER TABLE "BlockOptions" ADD COLUMN     "autoplay" TEXT,
ADD COLUMN     "filterFive" TEXT,
ADD COLUMN     "filterFour" TEXT,
ADD COLUMN     "filterOne" TEXT,
ADD COLUMN     "filterSix" TEXT,
ADD COLUMN     "filterThree" TEXT,
ADD COLUMN     "filterTwo" TEXT,
ADD COLUMN     "speed" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
