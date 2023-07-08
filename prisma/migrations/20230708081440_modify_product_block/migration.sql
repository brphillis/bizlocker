-- CreateTable
CREATE TABLE "_ProductCategoryToProductBlock" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BrandsToProductBlock" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductCategoryToProductBlock_AB_unique" ON "_ProductCategoryToProductBlock"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductCategoryToProductBlock_B_index" ON "_ProductCategoryToProductBlock"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BrandsToProductBlock_AB_unique" ON "_BrandsToProductBlock"("A", "B");

-- CreateIndex
CREATE INDEX "_BrandsToProductBlock_B_index" ON "_BrandsToProductBlock"("B");

-- AddForeignKey
ALTER TABLE "_ProductCategoryToProductBlock" ADD CONSTRAINT "_ProductCategoryToProductBlock_A_fkey" FOREIGN KEY ("A") REFERENCES "ProductBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductCategoryToProductBlock" ADD CONSTRAINT "_ProductCategoryToProductBlock_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BrandsToProductBlock" ADD CONSTRAINT "_BrandsToProductBlock_A_fkey" FOREIGN KEY ("A") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BrandsToProductBlock" ADD CONSTRAINT "_BrandsToProductBlock_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;
