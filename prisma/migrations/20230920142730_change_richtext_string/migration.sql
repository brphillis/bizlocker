-- AlterTable
ALTER TABLE "TextBlockContent" ALTER COLUMN "richText" SET NOT NULL,
ALTER COLUMN "richText" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
