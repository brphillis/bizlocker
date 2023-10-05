-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';

-- CreateTable
CREATE TABLE "PreviewPage" (
    "id" SERIAL NOT NULL,
    "backgroundColor" TEXT,
    "homePageId" INTEGER,
    "webPageId" INTEGER,
    "articleId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PreviewPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PreviewPageToBlocks" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PreviewPageToBlocks_AB_unique" ON "_PreviewPageToBlocks"("A", "B");

-- CreateIndex
CREATE INDEX "_PreviewPageToBlocks_B_index" ON "_PreviewPageToBlocks"("B");

-- AddForeignKey
ALTER TABLE "PreviewPage" ADD CONSTRAINT "PreviewPage_homePageId_fkey" FOREIGN KEY ("homePageId") REFERENCES "HomePage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreviewPage" ADD CONSTRAINT "PreviewPage_webPageId_fkey" FOREIGN KEY ("webPageId") REFERENCES "WebPage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreviewPage" ADD CONSTRAINT "PreviewPage_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PreviewPageToBlocks" ADD CONSTRAINT "_PreviewPageToBlocks_A_fkey" FOREIGN KEY ("A") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PreviewPageToBlocks" ADD CONSTRAINT "_PreviewPageToBlocks_B_fkey" FOREIGN KEY ("B") REFERENCES "PreviewPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
