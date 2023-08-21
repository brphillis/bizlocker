/*
  Warnings:

  - You are about to drop the column `addressId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `cartId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[articleBlockId]` on the table `Block` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Verifier` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_addressId_key";

-- DropIndex
DROP INDEX "User_cartId_key";

-- AlterTable
ALTER TABLE "Block" ADD COLUMN     "articleBlockId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "addressId",
DROP COLUMN "cartId";

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';

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

-- CreateIndex
CREATE UNIQUE INDEX "ArticleBlock_id_key" ON "ArticleBlock"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleBlockContent_id_key" ON "ArticleBlockContent"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleBlockContent_articleBlockId_key" ON "ArticleBlockContent"("articleBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "Block_articleBlockId_key" ON "Block"("articleBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "Verifier_email_key" ON "Verifier"("email");

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_articleBlockId_fkey" FOREIGN KEY ("articleBlockId") REFERENCES "ArticleBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleBlockContent" ADD CONSTRAINT "ArticleBlockContent_articleBlockId_fkey" FOREIGN KEY ("articleBlockId") REFERENCES "ArticleBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleBlockContent" ADD CONSTRAINT "ArticleBlockContent_articleCategoryId_fkey" FOREIGN KEY ("articleCategoryId") REFERENCES "ArticleCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
