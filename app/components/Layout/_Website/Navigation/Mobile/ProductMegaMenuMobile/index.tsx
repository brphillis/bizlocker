import { useState } from "react";
import { User } from "@prisma/client";
import { DepartmentWithDetails } from "~/models/Departments/types";
import { ProductCategoryWithDetails } from "~/models/ProductCategories/types";
import MenuFooter from "./MenuFooter";
import { PromotionWithContent } from "~/models/Promotions/types";
import Divider from "~/components/Filter/ProductFilterSideBar/Divider";
import TileImages from "./TileImages";
import GenderTabs from "./GenderTabs";
import CategoryCard from "./CategoryCard";
import { MegaMenuTypes } from "../../Desktop/ProductMegaMenu";

type Props = {
  departments: DepartmentWithDetails[];
  productCategories: ProductCategoryWithDetails[];
  user: User | null;
  randomPromotions: PromotionWithContent[];
};

const ProductMegaMenuMobile = ({
  departments,
  productCategories,
  user,
  randomPromotions,
}: Props) => {
  const [selectedDepartment] = useState<number>(departments?.[0].id);

  const [selectedTab, setSelectedTab] = useState<MegaMenuTypes>();

  const matchingProductCategories = productCategories.filter(
    (e: ProductCategoryWithDetails) => e.departmentId === selectedDepartment,
  );

  return (
    <div className="drawer-side">
      {/* eslint-disable */}
      <label
        htmlFor="mobile-navigation-state"
        className="drawer-overlay"
      ></label>
      {/* eslint-enable */}
      <ul className="z-100 menu relative !h-[100dvh] w-[21.5rem] max-w-[85vw] bg-brand-black px-4 text-brand-white flex flex-col">
        <div className="flex flex-col max-w-full h-full">
          <h1 className="w-full text-center cursor-pointer select-none text-3xl font-bold tracking-widest text-white my-3">
            CLUTCH.
          </h1>

          <Divider color={"white"} extendStyle="mt-3 mb-1" />

          <GenderTabs
            setSelectedTab={setSelectedTab}
            selectedTab={selectedTab}
          />

          <Divider color={"white"} extendStyle="mt-1 mb-3" />

          <div className="relative flex flex-col justify-between h-full overflow-auto">
            <div className="relative flex flex-col items-center gap-3 pb-3 max-h-full overflow-auto scrollbar-hide">
              {matchingProductCategories.map(
                ({
                  displayInNavigation,
                  id,
                  name,
                  productSubCategories,
                }: ProductCategoryWithDetails) => {
                  if (displayInNavigation) {
                    let image;

                    switch (selectedTab) {
                      case "Mens": {
                        image =
                          productSubCategories?.find((e) => e.maleImage)
                            ?.maleImage?.href ||
                          productSubCategories?.find((e) => e.tileImage?.href)
                            ?.tileImage?.href;
                        break;
                      }

                      case "Womans": {
                        image =
                          productSubCategories?.find((e) => e.femaleImage)
                            ?.femaleImage?.href ||
                          productSubCategories?.find((e) => e.tileImage?.href)
                            ?.tileImage?.href;
                        break;
                      }

                      case "Kids": {
                        image =
                          productSubCategories?.find((e) => e.kidImage)
                            ?.kidImage?.href ||
                          productSubCategories?.find((e) => e.tileImage?.href)
                            ?.tileImage?.href;
                        break;
                      }

                      default: {
                        image = productSubCategories?.find((e) => e.tileImage)
                          ?.tileImage?.href;
                        break;
                      }
                    }

                    return (
                      <CategoryCard
                        key={"mobileMenu_Dropdown_" + id}
                        name={name}
                        imageSrc={image}
                        selectedTab={selectedTab}
                      />
                    );
                  } else return null;
                },
              )}
              <TileImages randomPromotions={randomPromotions} />
            </div>

            <MenuFooter user={user} />
          </div>
        </div>
      </ul>
    </div>
  );
};

export default ProductMegaMenuMobile;
