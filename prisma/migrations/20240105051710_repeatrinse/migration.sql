/*
  Warnings:

  - The `blockOrder` column on the `HomePage` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `blockOrder` column on the `PreviewPage` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `blockOrder` column on the `WebPage` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "HomePage" DROP COLUMN "blockOrder",
ADD COLUMN     "blockOrder" INTEGER[];

-- AlterTable
ALTER TABLE "PreviewPage" DROP COLUMN "blockOrder",
ADD COLUMN     "blockOrder" INTEGER[];

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';

-- AlterTable
ALTER TABLE "WebPage" DROP COLUMN "blockOrder",
ADD COLUMN     "blockOrder" INTEGER[];
