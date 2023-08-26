-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DEVELOPER', 'ADMIN', 'STAFF', 'USER');

-- CreateEnum
CREATE TYPE "VerifyTypes" AS ENUM ('email', 'password');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'KIDS', 'UNISEX');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('created', 'cancelled', 'paid', 'shipped', 'complete');

-- CreateEnum
CREATE TYPE "SortBy" AS ENUM ('createdAt', 'totalSold', 'price', 'name');

-- CreateEnum
CREATE TYPE "SortOrder" AS ENUM ('asc', 'desc');

-- CreateEnum
CREATE TYPE "Color" AS ENUM ('RED', 'BLUE', 'GREEN', 'YELLOW', 'ORANGE', 'PURPLE', 'PINK', 'BLACK', 'WHITE', 'GRAY', 'BROWN', 'SILVER', 'GOLD', 'NAVY', 'TEAL', 'MAROON', 'LIME', 'OLIVE', 'AQUA', 'INDIGO');

-- CreateEnum
CREATE TYPE "Size" AS ENUM ('XS', 'S', 'M', 'L', 'XL', 'XXL');

-- CreateTable
CREATE TABLE "HomePage" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Homepage',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomePage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Block" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "homePageId" INTEGER,
    "articleId" INTEGER,
    "bannerBlockId" TEXT,
    "tileBlockId" TEXT,
    "textBlockId" TEXT,
    "productBlockId" TEXT,
    "articleBlockId" TEXT,
    "blockOptionsId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockOptions" (
    "id" TEXT NOT NULL,
    "columns" INTEGER,
    "rows" INTEGER,
    "count" INTEGER,
    "size" TEXT,
    "sortBy" "SortBy",
    "sortOrder" "SortOrder",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlockOptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BannerBlock" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'banner',
    "type" TEXT NOT NULL,
    "campaignId" INTEGER,
    "promotionId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BannerBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TileBlock" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'tile',
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TileBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextBlock" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'text',
    "content" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TextBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductBlock" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'product',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductBlockContent" (
    "id" TEXT NOT NULL,
    "productBlockId" TEXT,
    "subProductCategoryId" INTEGER,
    "productSubCategoryId" INTEGER,
    "brandId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductBlockContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleBlock" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'product',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticleBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleBlockContent" (
    "id" TEXT NOT NULL,
    "articleBlockId" TEXT,
    "articleCategoryId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticleBlockContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "doubleAuthentication" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "userDetailsId" TEXT,
    "googleLogin" BOOLEAN NOT NULL DEFAULT false,
    "googleEmail" TEXT,
    "microsoftLogin" BOOLEAN NOT NULL DEFAULT false,
    "microsoftEmail" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verifier" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "type" "VerifyTypes" NOT NULL,
    "code" TEXT,
    "expiration" TIMESTAMP(3) NOT NULL DEFAULT NOW() + interval '3 hours',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Verifier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDetails" (
    "id" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "phoneNumber" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "gender" "Gender",
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "postcode" TEXT,
    "suburb" TEXT,
    "state" TEXT,
    "country" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "cartId" INTEGER NOT NULL,
    "variantId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "orderId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "paymentCode" TEXT NOT NULL,
    "paymentUrl" TEXT NOT NULL,
    "paymentLinkId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "variantId" INTEGER NOT NULL,
    "orderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "userId" TEXT,
    "articleId" INTEGER,
    "productId" INTEGER,
    "productSubCategoryId" INTEGER,
    "brandId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "productBlockId" TEXT,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "subProductCategoryId" INTEGER,

    CONSTRAINT "ArticleCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductSubCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "subProductCategoryId" INTEGER,
    "imageId" INTEGER,

    CONSTRAINT "ProductSubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "minSaleRange" DOUBLE PRECISION NOT NULL,
    "maxSaleRange" DOUBLE PRECISION NOT NULL,
    "targetGender" "Gender",
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "tileImageId" INTEGER NOT NULL,
    "bannerImageId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promotion" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "discountPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "targetGender" "Gender",
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "tileImageId" INTEGER NOT NULL,
    "bannerImageId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "brandId" INTEGER,
    "discountPercentageHigh" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discountPercentageLow" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalSold" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "gender" "Gender",
    "promotionId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "salePrice" DOUBLE PRECISION,
    "isOnSale" BOOLEAN NOT NULL DEFAULT false,
    "stock" INTEGER,
    "productId" INTEGER NOT NULL,
    "color" "Color",
    "size" "Size",
    "totalSold" INTEGER NOT NULL DEFAULT 0,
    "orderId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPromoted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "imageId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ArticleCategoryToArticle" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CampaignToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductSubCategoryToCampaign" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CampaignToTileBlock" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PromotionToTileBlock" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductSubCategoryToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BrandToCampaign" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Block_id_key" ON "Block"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Block_bannerBlockId_key" ON "Block"("bannerBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "Block_tileBlockId_key" ON "Block"("tileBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "Block_textBlockId_key" ON "Block"("textBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "Block_productBlockId_key" ON "Block"("productBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "Block_articleBlockId_key" ON "Block"("articleBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "Block_blockOptionsId_key" ON "Block"("blockOptionsId");

-- CreateIndex
CREATE UNIQUE INDEX "BlockOptions_id_key" ON "BlockOptions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BannerBlock_id_key" ON "BannerBlock"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TileBlock_id_key" ON "TileBlock"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TextBlock_id_key" ON "TextBlock"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductBlock_id_key" ON "ProductBlock"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductBlockContent_id_key" ON "ProductBlockContent"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductBlockContent_productBlockId_key" ON "ProductBlockContent"("productBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleBlock_id_key" ON "ArticleBlock"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleBlockContent_id_key" ON "ArticleBlockContent"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleBlockContent_articleBlockId_key" ON "ArticleBlockContent"("articleBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_userDetailsId_key" ON "User"("userDetailsId");

-- CreateIndex
CREATE UNIQUE INDEX "Verifier_email_key" ON "Verifier"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserDetails_id_key" ON "UserDetails"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserDetails_userId_key" ON "UserDetails"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_id_key" ON "Address"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Address_userId_key" ON "Address"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_key" ON "Cart"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderId_key" ON "Order"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_userId_key" ON "Image"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_articleId_key" ON "Image"("articleId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_productSubCategoryId_key" ON "Image"("productSubCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_brandId_key" ON "Image"("brandId");

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_name_key" ON "ProductCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_productBlockId_key" ON "ProductCategory"("productBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleCategory_name_key" ON "ArticleCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProductSubCategory_name_key" ON "ProductSubCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Article_title_key" ON "Article"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_tileImageId_key" ON "Campaign"("tileImageId");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_bannerImageId_key" ON "Campaign"("bannerImageId");

-- CreateIndex
CREATE UNIQUE INDEX "Promotion_tileImageId_key" ON "Promotion"("tileImageId");

-- CreateIndex
CREATE UNIQUE INDEX "Promotion_bannerImageId_key" ON "Promotion"("bannerImageId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_sku_key" ON "ProductVariant"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_id_key" ON "Brand"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_ArticleCategoryToArticle_AB_unique" ON "_ArticleCategoryToArticle"("A", "B");

-- CreateIndex
CREATE INDEX "_ArticleCategoryToArticle_B_index" ON "_ArticleCategoryToArticle"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CampaignToProduct_AB_unique" ON "_CampaignToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_CampaignToProduct_B_index" ON "_CampaignToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductSubCategoryToCampaign_AB_unique" ON "_ProductSubCategoryToCampaign"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductSubCategoryToCampaign_B_index" ON "_ProductSubCategoryToCampaign"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CampaignToTileBlock_AB_unique" ON "_CampaignToTileBlock"("A", "B");

-- CreateIndex
CREATE INDEX "_CampaignToTileBlock_B_index" ON "_CampaignToTileBlock"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PromotionToTileBlock_AB_unique" ON "_PromotionToTileBlock"("A", "B");

-- CreateIndex
CREATE INDEX "_PromotionToTileBlock_B_index" ON "_PromotionToTileBlock"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductSubCategoryToProduct_AB_unique" ON "_ProductSubCategoryToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductSubCategoryToProduct_B_index" ON "_ProductSubCategoryToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BrandToCampaign_AB_unique" ON "_BrandToCampaign"("A", "B");

-- CreateIndex
CREATE INDEX "_BrandToCampaign_B_index" ON "_BrandToCampaign"("B");

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_homePageId_fkey" FOREIGN KEY ("homePageId") REFERENCES "HomePage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_bannerBlockId_fkey" FOREIGN KEY ("bannerBlockId") REFERENCES "BannerBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_tileBlockId_fkey" FOREIGN KEY ("tileBlockId") REFERENCES "TileBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_textBlockId_fkey" FOREIGN KEY ("textBlockId") REFERENCES "TextBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_productBlockId_fkey" FOREIGN KEY ("productBlockId") REFERENCES "ProductBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_articleBlockId_fkey" FOREIGN KEY ("articleBlockId") REFERENCES "ArticleBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_blockOptionsId_fkey" FOREIGN KEY ("blockOptionsId") REFERENCES "BlockOptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BannerBlock" ADD CONSTRAINT "BannerBlock_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BannerBlock" ADD CONSTRAINT "BannerBlock_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductBlockContent" ADD CONSTRAINT "ProductBlockContent_productBlockId_fkey" FOREIGN KEY ("productBlockId") REFERENCES "ProductBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductBlockContent" ADD CONSTRAINT "ProductBlockContent_subProductCategoryId_fkey" FOREIGN KEY ("subProductCategoryId") REFERENCES "ProductCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductBlockContent" ADD CONSTRAINT "ProductBlockContent_productSubCategoryId_fkey" FOREIGN KEY ("productSubCategoryId") REFERENCES "ProductSubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductBlockContent" ADD CONSTRAINT "ProductBlockContent_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleBlockContent" ADD CONSTRAINT "ArticleBlockContent_articleBlockId_fkey" FOREIGN KEY ("articleBlockId") REFERENCES "ArticleBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleBlockContent" ADD CONSTRAINT "ArticleBlockContent_articleCategoryId_fkey" FOREIGN KEY ("articleCategoryId") REFERENCES "ArticleCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDetails" ADD CONSTRAINT "UserDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("orderId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_productSubCategoryId_fkey" FOREIGN KEY ("productSubCategoryId") REFERENCES "ProductSubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleCategory" ADD CONSTRAINT "ArticleCategory_subProductCategoryId_fkey" FOREIGN KEY ("subProductCategoryId") REFERENCES "ProductCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSubCategory" ADD CONSTRAINT "ProductSubCategory_subProductCategoryId_fkey" FOREIGN KEY ("subProductCategoryId") REFERENCES "ProductCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_tileImageId_fkey" FOREIGN KEY ("tileImageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_bannerImageId_fkey" FOREIGN KEY ("bannerImageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_tileImageId_fkey" FOREIGN KEY ("tileImageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_bannerImageId_fkey" FOREIGN KEY ("bannerImageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleCategoryToArticle" ADD CONSTRAINT "_ArticleCategoryToArticle_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleCategoryToArticle" ADD CONSTRAINT "_ArticleCategoryToArticle_B_fkey" FOREIGN KEY ("B") REFERENCES "ArticleCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignToProduct" ADD CONSTRAINT "_CampaignToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignToProduct" ADD CONSTRAINT "_CampaignToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductSubCategoryToCampaign" ADD CONSTRAINT "_ProductSubCategoryToCampaign_A_fkey" FOREIGN KEY ("A") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductSubCategoryToCampaign" ADD CONSTRAINT "_ProductSubCategoryToCampaign_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductSubCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignToTileBlock" ADD CONSTRAINT "_CampaignToTileBlock_A_fkey" FOREIGN KEY ("A") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignToTileBlock" ADD CONSTRAINT "_CampaignToTileBlock_B_fkey" FOREIGN KEY ("B") REFERENCES "TileBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromotionToTileBlock" ADD CONSTRAINT "_PromotionToTileBlock_A_fkey" FOREIGN KEY ("A") REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromotionToTileBlock" ADD CONSTRAINT "_PromotionToTileBlock_B_fkey" FOREIGN KEY ("B") REFERENCES "TileBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductSubCategoryToProduct" ADD CONSTRAINT "_ProductSubCategoryToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductSubCategoryToProduct" ADD CONSTRAINT "_ProductSubCategoryToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductSubCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BrandToCampaign" ADD CONSTRAINT "_BrandToCampaign_A_fkey" FOREIGN KEY ("A") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BrandToCampaign" ADD CONSTRAINT "_BrandToCampaign_B_fkey" FOREIGN KEY ("B") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
