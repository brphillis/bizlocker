import BasicImage from "~/components/Client/BasicImage";
import { ProductSubCategoryWithDetails } from "~/models/ProductSubCategories/types";
import { MegaMenuTypes } from "../..";
import { ProductCategoryWithDetails } from "~/models/ProductCategories/types";

type Props = {
  activeMenu?: MegaMenuTypes;
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
    <div className="relative w-52 h-52 shadow-[0_18px_10px_-15px_rgba(0,0,0,0.5)] border-brand-white/10 border">
      <BasicImage
        alt="activeImage"
        extendStyle="h-full w-full hover:scale-[1.01] duration-300 cursor-pointer"
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
