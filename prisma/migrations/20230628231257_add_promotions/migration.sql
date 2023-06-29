-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "promotionId" TEXT;

-- CreateTable
CREATE TABLE "Promotion" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "discountPercentage" INTEGER NOT NULL,
    "targetGender" "Gender",
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "tileImageId" INTEGER NOT NULL,
    "bannerImageId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Promotion_id_key" ON "Promotion"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Promotion_tileImageId_key" ON "Promotion"("tileImageId");

-- CreateIndex
CREATE UNIQUE INDEX "Promotion_bannerImageId_key" ON "Promotion"("bannerImageId");

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_tileImageId_fkey" FOREIGN KEY ("tileImageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_bannerImageId_fkey" FOREIGN KEY ("bannerImageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
