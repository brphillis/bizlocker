-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DEVELOPER', 'ADMIN', 'MANAGER', 'STAFF', 'EDITOR', 'USER');

-- CreateEnum
CREATE TYPE "VerifyTypes" AS ENUM ('email', 'password');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'KIDS', 'UNISEX');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('created', 'cancelled', 'paid', 'shipped', 'complete');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('created', 'cancelled', 'approved', 'processing', 'complete');

-- CreateEnum
CREATE TYPE "SortBy" AS ENUM ('createdAt', 'totalSold', 'price', 'name', 'title');

-- CreateEnum
CREATE TYPE "SortOrder" AS ENUM ('asc', 'desc');

-- CreateEnum
CREATE TYPE "Color" AS ENUM ('RED', 'BLUE', 'GREEN', 'YELLOW', 'ORANGE', 'PURPLE', 'PINK', 'BLACK', 'WHITE', 'GRAY', 'BROWN', 'SILVER', 'GOLD', 'NAVY', 'TEAL', 'MAROON', 'LIME', 'OLIVE', 'AQUA', 'INDIGO', 'TRANSPARENTSM', 'TRANSPARENTMD', 'TRANSPARENTLG', 'TRANSPARENT');

-- CreateEnum
CREATE TYPE "PageType" AS ENUM ('homePage', 'article', 'webPage', 'previewPage');

-- CreateTable
CREATE TABLE "PreviewPage" (
    "id" SERIAL NOT NULL,
    "blockOrder" TEXT[],
    "title" TEXT NOT NULL DEFAULT 'Page Title',
    "description" TEXT NOT NULL DEFAULT 'Page Description',
    "backgroundColor" TEXT,
    "homePageId" INTEGER,
    "webPageId" INTEGER,
    "articleId" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TEXT,
    "publisher" TEXT,
    "createdAt" TEXT,
    "updatedAt" TEXT,

    CONSTRAINT "PreviewPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomePage" (
    "id" SERIAL NOT NULL,
    "blockOrder" TEXT[],
    "title" TEXT NOT NULL DEFAULT 'Homepage',
    "description" TEXT NOT NULL DEFAULT 'HomePage Description',
    "backgroundColor" TEXT,
    "createdAt" TEXT,
    "updatedAt" TEXT,

    CONSTRAINT "HomePage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebPage" (
    "id" SERIAL NOT NULL,
    "blockOrder" TEXT[],
    "description" TEXT NOT NULL DEFAULT 'Page Description',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT NOT NULL,
    "backgroundColor" TEXT,
    "createdAt" TEXT,
    "updatedAt" TEXT,

    CONSTRAINT "WebPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" SERIAL NOT NULL,
    "backgroundColor" TEXT,
    "blockOrder" TEXT[],
    "description" TEXT NOT NULL DEFAULT 'Article Description',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT NOT NULL,
    "createdAt" TEXT,
    "updatedAt" TEXT,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Block" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "createdAt" TEXT,
    "updatedAt" TEXT,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockContent" (
    "id" SERIAL NOT NULL,
    "gender" "Gender"[],
    "blockId" INTEGER,
    "emptyItem" TEXT[],
    "icon" TEXT[],
    "richText" TEXT,
    "createdAt" TEXT,
    "updatedAt" TEXT,

    CONSTRAINT "BlockContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockOptions" (
    "id" SERIAL NOT NULL,
    "align" TEXT,
    "alignMobile" TEXT,
    "autoplay" BOOLEAN,
    "backgroundBrightness" DOUBLE PRECISION,
    "backgroundBrightnessSecondary" DOUBLE PRECISION,
    "backgroundColor" TEXT,
    "backgroundColorSecondary" TEXT,
    "backgroundDisplay" TEXT,
    "backgroundPatternColor" TEXT,
    "backgroundPatternColorSecondary" TEXT,
    "backgroundPatternName" TEXT,
    "backgroundPatternNameSecondary" TEXT,
    "backgroundPatternOpacity" DOUBLE PRECISION,
    "backgroundPatternOpacitySecondary" DOUBLE PRECISION,
    "backgroundPatternSize" INTEGER,
    "backgroundPatternSizeSecondary" INTEGER,
    "backgroundWidth" TEXT,
    "backgroundWidthSecondary" TEXT,
    "blockId" INTEGER NOT NULL,
    "borderColor" TEXT,
    "borderDisplay" TEXT,
    "borderRadius" TEXT,
    "borderSize" TEXT,
    "buttonAlign" TEXT,
    "buttonBorderColorPrimary" TEXT,
    "buttonBorderColorSecondary" TEXT,
    "buttonColorPrimary" TEXT,
    "buttonColorSecondary" TEXT,
    "buttonLabelColorPrimary" TEXT,
    "buttonLabelColorSecondary" TEXT,
    "buttonLabelPrimary" TEXT,
    "buttonLabelSecondary" TEXT,
    "buttonLinkPrimary" TEXT,
    "buttonLinkSecondary" TEXT,
    "buttonPrimary" TEXT,
    "buttonSecondary" TEXT,
    "colorPrimary" TEXT,
    "colorSecondary" TEXT,
    "columns" DOUBLE PRECISION,
    "columnsMobile" DOUBLE PRECISION,
    "count" INTEGER,
    "flipX" TEXT,
    "height" TEXT,
    "heightMobile" TEXT,
    "imagePosition" TEXT,
    "imagePositionMobile" TEXT,
    "itemAlign" TEXT[],
    "itemAlignMobile" TEXT[],
    "itemBorderColors" TEXT[],
    "itemBorderDisplays" TEXT[],
    "itemBorderRadius" TEXT[],
    "itemBorderSizes" TEXT[],
    "itemButtonAlign" TEXT[],
    "itemColorOpacity" TEXT[],
    "itemColors" TEXT[],
    "itemFilters" TEXT[],
    "itemImagePositions" TEXT[],
    "itemImagePositionsMobile" TEXT[],
    "itemJustify" TEXT[],
    "itemJustifyMobile" TEXT[],
    "itemLinks" TEXT[],
    "itemButtonBorderColorsPrimary" TEXT[],
    "itemButtonColorsPrimary" TEXT[],
    "itemButtonLabelColorsPrimary" TEXT[],
    "itemButtonLabelsPrimary" TEXT[],
    "itemButtonLinksPrimary" TEXT[],
    "itemButtonsPrimary" TEXT[],
    "itemBackgroundBrightnessesSecondary" DOUBLE PRECISION[],
    "itemBackgroundPatternNamesSecondary" TEXT[],
    "itemBackgroundPatternColorsSecondary" TEXT[],
    "itemBackgroundWidthsSecondary" TEXT[],
    "itemBackgroundDisplaysSecondary" TEXT[],
    "itemBackgroundPatternSizesSecondary" INTEGER[],
    "itemBackgroundPatternOpacitiesSecondary" DOUBLE PRECISION[],
    "itemBackgroundColorsSecondary" TEXT[],
    "itemBackgroundColorsPrimary" TEXT[],
    "itemBackgroundBrightnessesPrimary" DOUBLE PRECISION[],
    "itemBackgroundPatternNamesPrimary" TEXT[],
    "itemBackgroundPatternColorsPrimary" TEXT[],
    "itemBackgroundWidthsPrimary" TEXT[],
    "itemBackgroundDisplaysPrimary" TEXT[],
    "itemBackgroundPatternSizesPrimary" INTEGER[],
    "itemBackgroundPatternOpacitiesPrimary" DOUBLE PRECISION[],
    "itemButtonBorderColorsSecondary" TEXT[],
    "itemButtonColorsSecondary" TEXT[],
    "itemButtonLabelColorsSecondary" TEXT[],
    "itemButtonLabelsSecondary" TEXT[],
    "itemButtonLinksSecondary" TEXT[],
    "itemButtonsSecondary" TEXT[],
    "itemColorsSecondary" TEXT[],
    "itemShortText" TEXT[],
    "itemShortTextColors" TEXT[],
    "itemShortTextSizes" TEXT[],
    "itemShortTextSizesMobile" TEXT[],
    "itemTitleColors" TEXT[],
    "itemTitles" TEXT[],
    "itemTitleFontWeights" TEXT[],
    "itemTitleFontWeightsMobile" TEXT[],
    "itemTitleSizes" TEXT[],
    "itemTitleSizesMobile" TEXT[],
    "justify" TEXT,
    "justifyMobile" TEXT,
    "linkPrimary" TEXT,
    "linkSecondary" TEXT,
    "margin" TEXT,
    "order" INTEGER,
    "padding" TEXT,
    "rows" INTEGER,
    "shortText" TEXT,
    "shortTextColor" TEXT,
    "size" TEXT,
    "sizeMobile" TEXT,
    "sortBy" "SortBy",
    "sortOrder" "SortOrder",
    "speed" INTEGER,
    "style" TEXT,
    "title" TEXT,
    "titleAlign" TEXT,
    "titleColor" TEXT,
    "titleSize" TEXT,
    "titleSizeMobile" TEXT,
    "titleFontWeight" TEXT,
    "titleFontWeightMobile" TEXT,
    "width" TEXT,
    "widthMobile" TEXT,
    "createdAt" TEXT,
    "updatedAt" TEXT,

    CONSTRAINT "BlockOptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Store" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "faxNumber" TEXT,
    "paymentProviderId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TEXT,
    "updatedAt" TEXT,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "storeId" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TEXT,
    "updatedAt" TEXT,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" SERIAL NOT NULL,
    "doubleAuthentication" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "role" "Role" NOT NULL DEFAULT 'STAFF',
    "jobTitle" TEXT,
    "password" TEXT,
    "userDetailsId" TEXT,
    "storeId" INTEGER,
    "teamId" INTEGER,
    "createdAt" TEXT,
    "updatedAt" TEXT,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "staffId" INTEGER,
    "storeId" INTEGER,
    "message" TEXT NOT NULL,
    "dismissed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TEXT,
    "updatedAt" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "doubleAuthentication" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT NOT NULL,
    "googleEmail" TEXT,
    "googleLogin" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "microsoftEmail" TEXT,
    "microsoftLogin" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "userDetailsId" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TEXT,
    "updatedAt" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verifier" (
    "id" SERIAL NOT NULL,
    "code" TEXT,
    "email" TEXT NOT NULL,
    "expiration" TIMESTAMP(3) NOT NULL DEFAULT NOW() + interval '3 hours',
    "type" "VerifyTypes" NOT NULL,
    "createdAt" TEXT,
    "updatedAt" TEXT,

    CONSTRAINT "Verifier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDetails" (
    "id" SERIAL NOT NULL,
    "dateOfBirth" TEXT,
    "firstName" TEXT,
    "gender" "Gender",
    "lastName" TEXT,
    "phoneNumber" TEXT,
    "staffId" INTEGER,
    "userId" INTEGER,
    "createdAt" TEXT,
    "updatedAt" TEXT,

    CONSTRAINT "UserDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "country" TEXT,
    "postcode" TEXT,
    "state" TEXT,
    "suburb" TEXT,
    "staffId" INTEGER,
    "userId" INTEGER,
    "orderId" INTEGER,
    "storeId" INTEGER,
    "latitude" TEXT,
    "longitude" TEXT,
    "createdAt" TEXT,
    "updatedAt" TEXT,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "createdAt" TEXT,
    "updatedAt" TEXT,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" SERIAL NOT NULL,
    "cartId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "variantId" INTEGER NOT NULL,
    "createdAt" TEXT,
    "updatedAt" TEXT,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "rememberInformation" BOOLEAN NOT NULL DEFAULT false,
    "paymentCode" TEXT NOT NULL,
    "paymentLinkId" TEXT NOT NULL,
    "paymentUrl" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER,
    "firstName" TEXT,
    "lastName" TEXT,
    "shippingMethod" TEXT,
    "shippingPrice" TEXT,
    "trackingNumber" TEXT,
    "phoneNumber" TEXT,
    "email" TEXT,
    "createdAt" TEXT,
    "updatedAt" TEXT,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "variantId" INTEGER NOT NULL,
    "storeId" INTEGER NOT NULL,
    "createdAt" TEXT,
    "updatedAt" TEXT,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "href" TEXT,
    "altText" TEXT,
    "articleId" INTEGER,
    "brandId" INTEGER,
    "productId" INTEGER,
    "productSubCategoryId" INTEGER,
    "userId" INTEGER,
    "staffId" INTEGER,
    "webPageId" INTEGER,
    "previewPageId" INTEGER,
    "createdAt" TEXT,
    "updatedAt" TEXT,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" SERIAL NOT NULL,
    "displayInNavigation" BOOLEAN NOT NULL DEFAULT true,
    "index" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "createdAt" TEXT,
    "updatedAt" TEXT,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCategory" (
    "id" SERIAL NOT NULL,
    "departmentId" INTEGER,
    "displayInNavigation" BOOLEAN NOT NULL DEFAULT true,
    "index" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "createdAt" TEXT,
    "updatedAt" TEXT,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleCategory" (
    "id" SERIAL NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "subProductCategoryId" INTEGER,
    "createdAt" TEXT,
    "updatedAt" TEXT,

    CONSTRAINT "ArticleCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductSubCategory" (
    "id" SERIAL NOT NULL,
    "displayInNavigation" BOOLEAN NOT NULL DEFAULT true,
    "imageId" INTEGER,
    "index" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "productCategoryId" INTEGER,
    "createdAt" TEXT,
    "updatedAt" TEXT,

    CONSTRAINT "ProductSubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" SERIAL NOT NULL,
    "bannerImageId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "maxSaleRange" DOUBLE PRECISION NOT NULL,
    "minSaleRange" DOUBLE PRECISION NOT NULL,
    "name" TEXT NOT NULL,
    "targetGender" "Gender",
    "tileImageId" INTEGER NOT NULL,
    "createdAt" TEXT,
    "updatedAt" TEXT,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promotion" (
    "id" SERIAL NOT NULL,
    "bannerImageId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "discountPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "metaDescription" TEXT,
    "targetGender" "Gender",
    "tileImageId" INTEGER NOT NULL,
    "createdAt" TEXT,
    "updatedAt" TEXT,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "brandId" INTEGER,
    "description" TEXT NOT NULL,
    "discountPercentageHigh" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discountPercentageLow" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "gender" "Gender",
    "heroImageId" INTEGER,
    "infoURL" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "promotionId" INTEGER,
    "totalSold" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TEXT,
    "updatedAt" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" SERIAL NOT NULL,
    "color" "Color",
    "height" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFragile" BOOLEAN NOT NULL DEFAULT false,
    "isOnSale" BOOLEAN NOT NULL DEFAULT false,
    "isPromoted" BOOLEAN NOT NULL DEFAULT false,
    "length" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "orderId" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "productId" INTEGER NOT NULL,
    "salePrice" DOUBLE PRECISION,
    "size" TEXT,
    "sku" TEXT NOT NULL,
    "totalSold" INTEGER NOT NULL DEFAULT 0,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "width" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TEXT,
    "updatedAt" TEXT,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockLevel" (
    "id" SERIAL NOT NULL,
    "productVariantId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "storeId" INTEGER NOT NULL,
    "createdAt" TEXT,
    "updatedAt" TEXT,

    CONSTRAINT "StockLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockTransferRequest" (
    "id" SERIAL NOT NULL,
    "fromStoreId" INTEGER NOT NULL,
    "productVariantId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'created',
    "trackingNumber" TEXT,
    "toStoreId" INTEGER NOT NULL,
    "approvedBy" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TEXT,
    "updatedAt" TEXT,

    CONSTRAINT "StockTransferRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" SERIAL NOT NULL,
    "imageId" INTEGER,
    "name" TEXT NOT NULL,
    "createdAt" TEXT,
    "updatedAt" TEXT,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ArticleCategoryToArticle" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ArticlesToBlocks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PreviewPageToBlocks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_HomePageToBlocks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_WebPagesToBlocks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BlockContentToProductSubCategories" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BlockContentToBrands" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BlockContentToCampaigns" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BlockContentToImages" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BlockContentToProducts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BlockContentToPromotions" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BlockContentToProductCategories" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BlockContentToStores" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BlockContentToArticleCategories" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ArticleCategoryToPreviewPage" (
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
CREATE UNIQUE INDEX "WebPage_title_key" ON "WebPage"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Article_title_key" ON "Article"("title");

-- CreateIndex
CREATE UNIQUE INDEX "BlockContent_blockId_key" ON "BlockContent"("blockId");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_email_key" ON "Staff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_userDetailsId_key" ON "Staff"("userDetailsId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_userDetailsId_key" ON "User"("userDetailsId");

-- CreateIndex
CREATE UNIQUE INDEX "Verifier_email_key" ON "Verifier"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserDetails_staffId_key" ON "UserDetails"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "UserDetails_userId_key" ON "UserDetails"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_staffId_key" ON "Address"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_userId_key" ON "Address"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_orderId_key" ON "Address"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_storeId_key" ON "Address"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_key" ON "Cart"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_articleId_key" ON "Image"("articleId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_brandId_key" ON "Image"("brandId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_productSubCategoryId_key" ON "Image"("productSubCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_userId_key" ON "Image"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_staffId_key" ON "Image"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_webPageId_key" ON "Image"("webPageId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_previewPageId_key" ON "Image"("previewPageId");

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_name_key" ON "ProductCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleCategory_name_key" ON "ArticleCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProductSubCategory_name_key" ON "ProductSubCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_bannerImageId_key" ON "Campaign"("bannerImageId");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_tileImageId_key" ON "Campaign"("tileImageId");

-- CreateIndex
CREATE UNIQUE INDEX "Promotion_bannerImageId_key" ON "Promotion"("bannerImageId");

-- CreateIndex
CREATE UNIQUE INDEX "Promotion_tileImageId_key" ON "Promotion"("tileImageId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_heroImageId_key" ON "Product"("heroImageId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_sku_key" ON "ProductVariant"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "StockLevel_productVariantId_storeId_key" ON "StockLevel"("productVariantId", "storeId");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_id_key" ON "Brand"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_ArticleCategoryToArticle_AB_unique" ON "_ArticleCategoryToArticle"("A", "B");

-- CreateIndex
CREATE INDEX "_ArticleCategoryToArticle_B_index" ON "_ArticleCategoryToArticle"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ArticlesToBlocks_AB_unique" ON "_ArticlesToBlocks"("A", "B");

-- CreateIndex
CREATE INDEX "_ArticlesToBlocks_B_index" ON "_ArticlesToBlocks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PreviewPageToBlocks_AB_unique" ON "_PreviewPageToBlocks"("A", "B");

-- CreateIndex
CREATE INDEX "_PreviewPageToBlocks_B_index" ON "_PreviewPageToBlocks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_HomePageToBlocks_AB_unique" ON "_HomePageToBlocks"("A", "B");

-- CreateIndex
CREATE INDEX "_HomePageToBlocks_B_index" ON "_HomePageToBlocks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_WebPagesToBlocks_AB_unique" ON "_WebPagesToBlocks"("A", "B");

-- CreateIndex
CREATE INDEX "_WebPagesToBlocks_B_index" ON "_WebPagesToBlocks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BlockContentToProductSubCategories_AB_unique" ON "_BlockContentToProductSubCategories"("A", "B");

-- CreateIndex
CREATE INDEX "_BlockContentToProductSubCategories_B_index" ON "_BlockContentToProductSubCategories"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BlockContentToBrands_AB_unique" ON "_BlockContentToBrands"("A", "B");

-- CreateIndex
CREATE INDEX "_BlockContentToBrands_B_index" ON "_BlockContentToBrands"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BlockContentToCampaigns_AB_unique" ON "_BlockContentToCampaigns"("A", "B");

-- CreateIndex
CREATE INDEX "_BlockContentToCampaigns_B_index" ON "_BlockContentToCampaigns"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BlockContentToImages_AB_unique" ON "_BlockContentToImages"("A", "B");

-- CreateIndex
CREATE INDEX "_BlockContentToImages_B_index" ON "_BlockContentToImages"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BlockContentToProducts_AB_unique" ON "_BlockContentToProducts"("A", "B");

-- CreateIndex
CREATE INDEX "_BlockContentToProducts_B_index" ON "_BlockContentToProducts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BlockContentToPromotions_AB_unique" ON "_BlockContentToPromotions"("A", "B");

-- CreateIndex
CREATE INDEX "_BlockContentToPromotions_B_index" ON "_BlockContentToPromotions"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BlockContentToProductCategories_AB_unique" ON "_BlockContentToProductCategories"("A", "B");

-- CreateIndex
CREATE INDEX "_BlockContentToProductCategories_B_index" ON "_BlockContentToProductCategories"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BlockContentToStores_AB_unique" ON "_BlockContentToStores"("A", "B");

-- CreateIndex
CREATE INDEX "_BlockContentToStores_B_index" ON "_BlockContentToStores"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BlockContentToArticleCategories_AB_unique" ON "_BlockContentToArticleCategories"("A", "B");

-- CreateIndex
CREATE INDEX "_BlockContentToArticleCategories_B_index" ON "_BlockContentToArticleCategories"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ArticleCategoryToPreviewPage_AB_unique" ON "_ArticleCategoryToPreviewPage"("A", "B");

-- CreateIndex
CREATE INDEX "_ArticleCategoryToPreviewPage_B_index" ON "_ArticleCategoryToPreviewPage"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CampaignToProduct_AB_unique" ON "_CampaignToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_CampaignToProduct_B_index" ON "_CampaignToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductSubCategoryToCampaign_AB_unique" ON "_ProductSubCategoryToCampaign"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductSubCategoryToCampaign_B_index" ON "_ProductSubCategoryToCampaign"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductSubCategoryToProduct_AB_unique" ON "_ProductSubCategoryToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductSubCategoryToProduct_B_index" ON "_ProductSubCategoryToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BrandToCampaign_AB_unique" ON "_BrandToCampaign"("A", "B");

-- CreateIndex
CREATE INDEX "_BrandToCampaign_B_index" ON "_BrandToCampaign"("B");

-- AddForeignKey
ALTER TABLE "PreviewPage" ADD CONSTRAINT "PreviewPage_homePageId_fkey" FOREIGN KEY ("homePageId") REFERENCES "HomePage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreviewPage" ADD CONSTRAINT "PreviewPage_webPageId_fkey" FOREIGN KEY ("webPageId") REFERENCES "WebPage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreviewPage" ADD CONSTRAINT "PreviewPage_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockContent" ADD CONSTRAINT "BlockContent_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockOptions" ADD CONSTRAINT "BlockOptions_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDetails" ADD CONSTRAINT "UserDetails_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDetails" ADD CONSTRAINT "UserDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_productSubCategoryId_fkey" FOREIGN KEY ("productSubCategoryId") REFERENCES "ProductSubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_webPageId_fkey" FOREIGN KEY ("webPageId") REFERENCES "WebPage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_previewPageId_fkey" FOREIGN KEY ("previewPageId") REFERENCES "PreviewPage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleCategory" ADD CONSTRAINT "ArticleCategory_subProductCategoryId_fkey" FOREIGN KEY ("subProductCategoryId") REFERENCES "ProductCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSubCategory" ADD CONSTRAINT "ProductSubCategory_productCategoryId_fkey" FOREIGN KEY ("productCategoryId") REFERENCES "ProductCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_bannerImageId_fkey" FOREIGN KEY ("bannerImageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_tileImageId_fkey" FOREIGN KEY ("tileImageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_bannerImageId_fkey" FOREIGN KEY ("bannerImageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_tileImageId_fkey" FOREIGN KEY ("tileImageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_heroImageId_fkey" FOREIGN KEY ("heroImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockLevel" ADD CONSTRAINT "StockLevel_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockLevel" ADD CONSTRAINT "StockLevel_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockTransferRequest" ADD CONSTRAINT "StockTransferRequest_fromStoreId_fkey" FOREIGN KEY ("fromStoreId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockTransferRequest" ADD CONSTRAINT "StockTransferRequest_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockTransferRequest" ADD CONSTRAINT "StockTransferRequest_toStoreId_fkey" FOREIGN KEY ("toStoreId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleCategoryToArticle" ADD CONSTRAINT "_ArticleCategoryToArticle_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleCategoryToArticle" ADD CONSTRAINT "_ArticleCategoryToArticle_B_fkey" FOREIGN KEY ("B") REFERENCES "ArticleCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticlesToBlocks" ADD CONSTRAINT "_ArticlesToBlocks_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticlesToBlocks" ADD CONSTRAINT "_ArticlesToBlocks_B_fkey" FOREIGN KEY ("B") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PreviewPageToBlocks" ADD CONSTRAINT "_PreviewPageToBlocks_A_fkey" FOREIGN KEY ("A") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PreviewPageToBlocks" ADD CONSTRAINT "_PreviewPageToBlocks_B_fkey" FOREIGN KEY ("B") REFERENCES "PreviewPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HomePageToBlocks" ADD CONSTRAINT "_HomePageToBlocks_A_fkey" FOREIGN KEY ("A") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HomePageToBlocks" ADD CONSTRAINT "_HomePageToBlocks_B_fkey" FOREIGN KEY ("B") REFERENCES "HomePage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WebPagesToBlocks" ADD CONSTRAINT "_WebPagesToBlocks_A_fkey" FOREIGN KEY ("A") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WebPagesToBlocks" ADD CONSTRAINT "_WebPagesToBlocks_B_fkey" FOREIGN KEY ("B") REFERENCES "WebPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockContentToProductSubCategories" ADD CONSTRAINT "_BlockContentToProductSubCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "BlockContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockContentToProductSubCategories" ADD CONSTRAINT "_BlockContentToProductSubCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductSubCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockContentToBrands" ADD CONSTRAINT "_BlockContentToBrands_A_fkey" FOREIGN KEY ("A") REFERENCES "BlockContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockContentToBrands" ADD CONSTRAINT "_BlockContentToBrands_B_fkey" FOREIGN KEY ("B") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockContentToCampaigns" ADD CONSTRAINT "_BlockContentToCampaigns_A_fkey" FOREIGN KEY ("A") REFERENCES "BlockContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockContentToCampaigns" ADD CONSTRAINT "_BlockContentToCampaigns_B_fkey" FOREIGN KEY ("B") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockContentToImages" ADD CONSTRAINT "_BlockContentToImages_A_fkey" FOREIGN KEY ("A") REFERENCES "BlockContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockContentToImages" ADD CONSTRAINT "_BlockContentToImages_B_fkey" FOREIGN KEY ("B") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockContentToProducts" ADD CONSTRAINT "_BlockContentToProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "BlockContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockContentToProducts" ADD CONSTRAINT "_BlockContentToProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockContentToPromotions" ADD CONSTRAINT "_BlockContentToPromotions_A_fkey" FOREIGN KEY ("A") REFERENCES "BlockContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockContentToPromotions" ADD CONSTRAINT "_BlockContentToPromotions_B_fkey" FOREIGN KEY ("B") REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockContentToProductCategories" ADD CONSTRAINT "_BlockContentToProductCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "BlockContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockContentToProductCategories" ADD CONSTRAINT "_BlockContentToProductCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockContentToStores" ADD CONSTRAINT "_BlockContentToStores_A_fkey" FOREIGN KEY ("A") REFERENCES "BlockContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockContentToStores" ADD CONSTRAINT "_BlockContentToStores_B_fkey" FOREIGN KEY ("B") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockContentToArticleCategories" ADD CONSTRAINT "_BlockContentToArticleCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "ArticleCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockContentToArticleCategories" ADD CONSTRAINT "_BlockContentToArticleCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "BlockContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleCategoryToPreviewPage" ADD CONSTRAINT "_ArticleCategoryToPreviewPage_A_fkey" FOREIGN KEY ("A") REFERENCES "ArticleCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleCategoryToPreviewPage" ADD CONSTRAINT "_ArticleCategoryToPreviewPage_B_fkey" FOREIGN KEY ("B") REFERENCES "PreviewPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignToProduct" ADD CONSTRAINT "_CampaignToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignToProduct" ADD CONSTRAINT "_CampaignToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductSubCategoryToCampaign" ADD CONSTRAINT "_ProductSubCategoryToCampaign_A_fkey" FOREIGN KEY ("A") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductSubCategoryToCampaign" ADD CONSTRAINT "_ProductSubCategoryToCampaign_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductSubCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductSubCategoryToProduct" ADD CONSTRAINT "_ProductSubCategoryToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductSubCategoryToProduct" ADD CONSTRAINT "_ProductSubCategoryToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductSubCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BrandToCampaign" ADD CONSTRAINT "_BrandToCampaign_A_fkey" FOREIGN KEY ("A") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BrandToCampaign" ADD CONSTRAINT "_BrandToCampaign_B_fkey" FOREIGN KEY ("B") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
