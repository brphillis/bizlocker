/*
  Warnings:

  - You are about to drop the column `colorFive` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `colorFour` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `colorOne` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `colorSecondaryFive` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `colorSecondaryFour` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `colorSecondaryOne` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `colorSecondarySix` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `colorSecondaryThree` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `colorSecondaryTwo` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `colorSix` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `colorThree` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `colorTwo` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `filterFive` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `filterFour` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `filterOne` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `filterSix` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `filterThree` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `filterTwo` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `linkFive` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `linkFour` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `linkOne` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `linkSix` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `linkThree` on the `BlockOptions` table. All the data in the column will be lost.
  - You are about to drop the column `linkTwo` on the `BlockOptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BlockOptions" DROP COLUMN "colorFive",
DROP COLUMN "colorFour",
DROP COLUMN "colorOne",
DROP COLUMN "colorSecondaryFive",
DROP COLUMN "colorSecondaryFour",
DROP COLUMN "colorSecondaryOne",
DROP COLUMN "colorSecondarySix",
DROP COLUMN "colorSecondaryThree",
DROP COLUMN "colorSecondaryTwo",
DROP COLUMN "colorSix",
DROP COLUMN "colorThree",
DROP COLUMN "colorTwo",
DROP COLUMN "filterFive",
DROP COLUMN "filterFour",
DROP COLUMN "filterOne",
DROP COLUMN "filterSix",
DROP COLUMN "filterThree",
DROP COLUMN "filterTwo",
DROP COLUMN "linkFive",
DROP COLUMN "linkFour",
DROP COLUMN "linkOne",
DROP COLUMN "linkSix",
DROP COLUMN "linkThree",
DROP COLUMN "linkTwo",
ADD COLUMN     "color1" TEXT,
ADD COLUMN     "color2" TEXT,
ADD COLUMN     "color3" TEXT,
ADD COLUMN     "color4" TEXT,
ADD COLUMN     "color5" TEXT,
ADD COLUMN     "color6" TEXT,
ADD COLUMN     "colorSecondary1" TEXT,
ADD COLUMN     "colorSecondary2" TEXT,
ADD COLUMN     "colorSecondary3" TEXT,
ADD COLUMN     "colorSecondary4" TEXT,
ADD COLUMN     "colorSecondary5" TEXT,
ADD COLUMN     "colorSecondary6" TEXT,
ADD COLUMN     "filter1" TEXT,
ADD COLUMN     "filter2" TEXT,
ADD COLUMN     "filter3" TEXT,
ADD COLUMN     "filter4" TEXT,
ADD COLUMN     "filter5" TEXT,
ADD COLUMN     "filter6" TEXT,
ADD COLUMN     "link1" TEXT,
ADD COLUMN     "link2" TEXT,
ADD COLUMN     "link3" TEXT,
ADD COLUMN     "link4" TEXT,
ADD COLUMN     "link5" TEXT,
ADD COLUMN     "link6" TEXT;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "expiration" SET DEFAULT NOW() + interval '3 hours';
