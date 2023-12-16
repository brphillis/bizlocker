/*
  Warnings:

  - You are about to drop the column `color1` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `color2` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `color3` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `color4` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `color5` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `color6` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `colorSecondary1` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `colorSecondary2` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `colorSecondary3` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `colorSecondary4` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `colorSecondary5` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `colorSecondary6` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `filter1` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `filter2` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `filter3` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `filter4` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `filter5` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `filter6` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `link1` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `link2` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `link3` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `link4` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `link5` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `link6` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `title1` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `title2` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `title3` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `title4` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `title5` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `title6` on the `BlockOptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BlockOptions" DROP COLUMN "color1",
DROP COLUMN "color2",
DROP COLUMN "color3",
DROP COLUMN "color4",
DROP COLUMN "color5",
DROP COLUMN "color6",
DROP COLUMN "colorSecondary1",
DROP COLUMN "colorSecondary2",
DROP COLUMN "colorSecondary3",
DROP COLUMN "colorSecondary4",
DROP COLUMN "colorSecondary5",
DROP COLUMN "colorSecondary6",
DROP COLUMN "filter1",
DROP COLUMN "filter2",
DROP COLUMN "filter3",
DROP COLUMN "filter4",
DROP COLUMN "filter5",
DROP COLUMN "filter6",
DROP COLUMN "link1",
DROP COLUMN "link2",
DROP COLUMN "link3",
DROP COLUMN "link4",
DROP COLUMN "link5",
DROP COLUMN "link6",
DROP COLUMN "title1",
DROP COLUMN "title2",
DROP COLUMN "title3",
DROP COLUMN "title4",
DROP COLUMN "title5",
DROP COLUMN "title6",
ADD COLUMN     "itemFilters" TEXT[],
ADD COLUMN     "itemSecondaryColors" TEXT[],
ADD COLUMN     "itemTitles" TEXT[];

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
