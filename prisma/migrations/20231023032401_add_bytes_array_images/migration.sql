/*
  Warnings:

  - The `blob` column on the `Image` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "blob",
ADD COLUMN     "blob" BYTEA[];

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
