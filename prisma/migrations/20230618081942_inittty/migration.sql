-- DropForeignKey
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_orderId_fkey";

-- CreateTable
CREATE TABLE "_OrderToProductVariant" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OrderToProductVariant_AB_unique" ON "_OrderToProductVariant"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderToProductVariant_B_index" ON "_OrderToProductVariant"("B");

-- AddForeignKey
ALTER TABLE "_OrderToProductVariant" ADD CONSTRAINT "_OrderToProductVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "Order"("orderId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderToProductVariant" ADD CONSTRAINT "_OrderToProductVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
