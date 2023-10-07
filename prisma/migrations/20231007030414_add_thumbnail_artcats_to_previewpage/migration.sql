/*
  Warnings:

  - A unique constraint covering the columns `[previewPageId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "previewPageId" INTEGER;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';

-- CreateIndex
CREATE UNIQUE INDEX "Image_previewPageId_key" ON "Image"("previewPageId");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_previewPageId_fkey" FOREIGN KEY ("previewPageId") REFERENCES "PreviewPage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
