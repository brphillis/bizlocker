/*
  Warnings:

  - You are about to drop the column `type` on the `BannerBlock` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `TileBlock` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BannerBlock" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "TileBlock" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
