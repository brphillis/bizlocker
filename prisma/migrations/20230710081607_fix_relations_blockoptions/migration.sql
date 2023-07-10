-- DropForeignKey
ALTER TABLE "BlockOptions" DROP CONSTRAINT "BlockOptions_blockOptionsId_fkey";

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_blockOptionsId_fkey" FOREIGN KEY ("blockOptionsId") REFERENCES "BlockOptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
