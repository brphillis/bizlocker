import { MegaMenuTypes } from "..";
import { ProductSubCategoryWithDetails } from "~/models/ProductSubCategories/types";
import { PromotionWithContent } from "~/models/Promotions/types";
import { getRandomOneOrTwo } from "~/helpers/numberHelpers";
import PromotionTile from "./PromotionTile";
import CategoryTile from "./CategoryTile";
import { ProductCategoryWithDetails } from "~/models/ProductCategories/types";
import { useEffect, useState } from "react";

type Props = {
  randomPromotions: PromotionWithContent[];
  activeMenu: MegaMenuTypes;
  activeCategory?: ProductCategoryWithDetails | ProductSubCategoryWithDetails;
};

const TileImages = ({
  randomPromotions,
  activeMenu,
  activeCategory,
}: Props) => {
  const [categoryTileHref, setCategoryTileHref] = useState<
    string | null | undefined
  >();

  const isSubCategory =
    (activeCategory as ProductSubCategoryWithDetails)?.femaleImage ||
    (activeCategory as ProductSubCategoryWithDetails)?.maleImage ||
    (activeCategory as ProductSubCategoryWithDetails)?.kidImage;

  useEffect(() => {
    const handleGetActiveCategoryImage = (): string | null | undefined => {
      const randomNumber = getRandomOneOrTwo();
      const productSubCategory =
        activeCategory as ProductSubCategoryWithDetails;
      const productCategory = activeCategory as ProductCategoryWithDetails;

      // we get the correct image for the product sub category
      if (isSubCategory) {
        switch (activeMenu) {
          case "mens": {
            return productSubCategory.maleImage?.href;
          }
          case "womans": {
            return productSubCategory.femaleImage?.href;
          }
          case "kids": {
            return productSubCategory.kidImage?.href;
          }
          case "sale": {
            if (randomNumber === 1) {
              return productSubCategory.maleImage?.href;
            } else {
              return productSubCategory.femaleImage?.href;
            }
          }
        }
      } else {
        // we get a random subcategory gendered image for the category
        const subCategoryCount =
          productCategory?.productSubCategories?.length || 1;

        const randomCategoryIndex = Math.floor(
          Math.random() * subCategoryCount,
        );

        switch (activeMenu) {
          case "mens": {
            return (
              productCategory?.productSubCategories?.[randomCategoryIndex]
                ?.maleImage?.href || null
            );
          }
          case "womans": {
            return (
              productCategory?.productSubCategories?.[randomCategoryIndex]
                ?.femaleImage?.href || null
            );
          }
          case "kids": {
            return (
              productCategory?.productSubCategories?.[randomCategoryIndex]
                ?.kidImage?.href || null
            );
          }
          case "sale": {
            if (randomNumber === 1) {
              return (
                productCategory?.productSubCategories?.[randomCategoryIndex]
                  ?.maleImage?.href || null
              );
            } else {
              return (
                productCategory?.productSubCategories?.[randomCategoryIndex]
                  ?.femaleImage?.href || null
              );
            }
          }
        }
      }
    };

    if (activeCategory) {
      setCategoryTileHref(handleGetActiveCategoryImage());
    }
  }, [activeCategory, activeMenu, isSubCategory]);

  return (
    <div className="flex items-center gap-3">
      {categoryTileHref && (
        <CategoryTile
          activeCategory={activeCategory!}
          activeMenu={activeMenu}
          imageSrc={categoryTileHref}
        />
      )}

      {!categoryTileHref && <PromotionTile promotion={randomPromotions[0]} />}

      <PromotionTile promotion={randomPromotions[1]} />
    </div>
  );
};

export default TileImages;
