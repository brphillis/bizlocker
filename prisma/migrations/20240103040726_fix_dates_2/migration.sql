-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ArticleBlock" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ArticleBlockContent" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ArticleCategory" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "BannerBlock" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "BannerBlockContent" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Block" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Brand" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Campaign" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CarouselBlock" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CarouselBlockContent" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Cart" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CartItem" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Department" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "HeroBlock" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "HeroBlockContent" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "HomePage" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MapBlock" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MapBlockContent" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProductBlock" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProductBlockContent" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProductCategory" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProductSubCategory" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProductVariant" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Promotion" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Staff" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "StockLevel" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "StockTransferRequest" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Store" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TextBlock" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TextBlockContent" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TileBlock" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TileBlockContent" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserDetails" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours',
ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "WebPage" ALTER COLUMN "createdAt" DROP NOT NULL;
