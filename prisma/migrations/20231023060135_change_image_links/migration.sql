/*
  Warnings:

  - You are about to drop the column `data` on the `Image` table. All the data in the column will be lost.
  - Added the required column `href` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `repoLink` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "data",
ADD COLUMN     "href" TEXT NOT NULL,
ADD COLUMN     "repoLink" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
