-- DropForeignKey
ALTER TABLE "Block" DROP CONSTRAINT "Block_articleId_fkey";

-- DropForeignKey
ALTER TABLE "Block" DROP CONSTRAINT "Block_homePageId_fkey";

-- AlterTable
ALTER TABLE "Block" ALTER COLUMN "homePageId" DROP NOT NULL,
ALTER COLUMN "articleId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_homePageId_fkey" FOREIGN KEY ("homePageId") REFERENCES "HomePage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;
