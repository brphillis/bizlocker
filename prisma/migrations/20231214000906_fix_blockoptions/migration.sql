/*
  Warnings:

  - Made the column `blockId` on table `BlockOptions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "BlockOptions" DROP CONSTRAINT "BlockOptions_blockId_fkey";

-- AlterTable
ALTER TABLE "BlockOptions" ALTER COLUMN "blockId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';

-- AddForeignKey
ALTER TABLE "BlockOptions" ADD CONSTRAINT "BlockOptions_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
