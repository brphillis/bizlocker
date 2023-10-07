-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';

-- CreateTable
CREATE TABLE "_ArticleCategoryToPreviewPage" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ArticleCategoryToPreviewPage_AB_unique" ON "_ArticleCategoryToPreviewPage"("A", "B");

-- CreateIndex
CREATE INDEX "_ArticleCategoryToPreviewPage_B_index" ON "_ArticleCategoryToPreviewPage"("B");

-- AddForeignKey
ALTER TABLE "_ArticleCategoryToPreviewPage" ADD CONSTRAINT "_ArticleCategoryToPreviewPage_A_fkey" FOREIGN KEY ("A") REFERENCES "ArticleCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleCategoryToPreviewPage" ADD CONSTRAINT "_ArticleCategoryToPreviewPage_B_fkey" FOREIGN KEY ("B") REFERENCES "PreviewPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
