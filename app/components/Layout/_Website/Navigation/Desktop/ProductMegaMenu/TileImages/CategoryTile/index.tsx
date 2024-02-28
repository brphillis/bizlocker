import BasicImage from "~/components/Client/BasicImage";
import { ProductSubCategoryWithDetails } from "~/models/ProductSubCategories/types";
import { MegaMenuTypes } from "../..";
import { ProductCategoryWithDetails } from "~/models/ProductCategories/types";

type Props = {
  activeMenu: MegaMenuTypes;
  activeCategory: ProductCategoryWithDetails | ProductSubCategoryWithDetails;
  imageSrc: string;
};

const CategoryTile = ({ activeMenu, activeCategory, imageSrc }: Props) => {
  const isSubCategory =
    (activeCategory as ProductSubCategoryWithDetails).femaleImage ||
    (activeCategory as ProductSubCategoryWithDetails).maleImage ||
    (activeCategory as ProductSubCategoryWithDetails).kidImage;

  const returnQueryString = (): string => {
    let queryString = "";

    if (isSubCategory) {
      queryString = `?productSubCategory=${activeCategory.name}`;
    } else {
      queryString = `?productCategory=${activeCategory.name}`;
    }

    if (activeMenu === "sale") {
      queryString += "&onSale=true";
    } else {
      queryString += `&gender=${activeMenu}`;
    }
    return queryString;
  };

  return (
    <div className="h-52 w-52 relative hover:scale-[1.01] duration-300 cursor-pointer">
      <BasicImage
        alt="activeImage"
        src={imageSrc}
        link={"/products" + returnQueryString()}
      />
      <div className="bg-black/75 font-bold text-brand-white bottom-0 left-[50%] translate-x-[-50%] absolute w-full px-3 py-3">
        {activeCategory.name}
      </div>
    </div>
  );
};

export default CategoryTile;
