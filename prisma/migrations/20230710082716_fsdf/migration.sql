/*
  Warnings:

  - You are about to drop the column `blockOptionsId` on the `BlockOptions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "BlockOptions_blockOptionsId_key";

-- AlterTable
ALTER TABLE "BlockOptions" DROP COLUMN "blockOptionsId";
