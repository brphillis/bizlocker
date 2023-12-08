/*
  Warnings:

  - Made the column `createdAt` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Article` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Article` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `ArticleBlock` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `ArticleBlock` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `ArticleBlockContent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `ArticleBlockContent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `ArticleCategory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `ArticleCategory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `BannerBlock` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `BannerBlock` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `BannerBlockContent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `BannerBlockContent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Block` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Block` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `BlockOptions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `BlockOptions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Brand` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Brand` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Campaign` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Campaign` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Cart` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Cart` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `CartItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `CartItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Department` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Department` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `HeroBlock` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `HeroBlock` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `HeroBlockContent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `HeroBlockContent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `HomePage` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `HomePage` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `MapBlock` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `MapBlock` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `MapBlockContent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `MapBlockContent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `OrderItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `OrderItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `ProductBlock` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `ProductBlock` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `ProductBlockContent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `ProductBlockContent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `ProductCategory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `ProductCategory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `ProductSubCategory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `ProductSubCategory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `ProductVariant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `ProductVariant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Promotion` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Promotion` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Staff` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Staff` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `StockLevel` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `StockLevel` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `StockTransferRequest` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `StockTransferRequest` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Store` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Store` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Team` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Team` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `TextBlock` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `TextBlock` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `TextBlockContent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `TextBlockContent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `TileBlock` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `TileBlock` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `TileBlockContent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `TileBlockContent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `UserDetails` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `UserDetails` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Verifier` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Verifier` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `WebPage` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `WebPage` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "ArticleBlock" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "ArticleBlockContent" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "ArticleCategory" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "BannerBlock" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "BannerBlockContent" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "Block" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "BlockOptions" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "Brand" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "Campaign" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "Cart" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "CartItem" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "Department" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "HeroBlock" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "HeroBlockContent" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "HomePage" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "MapBlock" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "MapBlockContent" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "ProductBlock" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "ProductBlockContent" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "ProductCategory" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "ProductSubCategory" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "ProductVariant" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "Promotion" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "Staff" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "StockLevel" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "StockTransferRequest" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "Store" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "TextBlock" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "TextBlockContent" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "TileBlock" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "TileBlockContent" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "UserDetails" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours',
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';

-- AlterTable
ALTER TABLE "WebPage" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT '2023-12-07T15:30:00Z',
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-07T15:30:00Z';
