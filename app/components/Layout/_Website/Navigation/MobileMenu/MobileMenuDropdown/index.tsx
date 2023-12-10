import React from "react";
import type { ProductSubCategoryWithDetails } from "~/models/productSubCategories.server";
import MobileMenuItem from "./MobileMenuItem";

type Props = {
  id: number;
  name: string;
  productSubCategories?: ProductSubCategoryWithDetails[] | null;
};

const MobileMenuDropdown = ({ name, productSubCategories }: Props) => {
  return (
    <li className="cursor-pointer border-b-2 border-primary-content/0 px-3 text-sm font-bold tracking-wide !opacity-100">
      <div className="collapse !visible w-full !auto-cols-auto !gap-0 !p-0">
        <input type="checkbox" className="peer absolute top-0" />
        <div className="relative flex w-full items-center justify-between py-3 text-sm font-semibold peer-checked:mb-2 peer-checked:border-b peer-checked:border-b-white/10 peer-checked:pl-2">
          {name}
        </div>
        <div className="collapse-content">
          {productSubCategories?.map(
            (
              {
                name: productSubCategoryName,
                displayInNavigation: displaySubCategory,
              }: ProductSubCategoryWithDetails,
              i: number
            ) => {
              if (displaySubCategory) {
                return (
                  <React.Fragment key={"mobileMenu_dropdownItem_" + name + i}>
                    <MobileMenuItem
                      productCategoryName={name}
                      productSubCategoryName={productSubCategoryName}
                    />
                  </React.Fragment>
                );
              } else return null;
            }
          )}
        </div>
      </div>
    </li>
  );
};

export default MobileMenuDropdown;
