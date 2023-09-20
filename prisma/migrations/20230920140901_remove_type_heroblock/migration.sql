/*
  Warnings:

  - You are about to drop the column `type` on the `HeroBlock` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HeroBlock" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
