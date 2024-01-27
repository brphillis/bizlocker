import { useState } from "react";
import { Cart, User } from "@prisma/client";
import { useNavigate } from "@remix-run/react";
import { PromotionWithContent } from "~/models/Promotions/types";
import { DepartmentWithDetails } from "~/models/Departments/types";
import Divider from "~/components/Filter/ProductFilterSideBar/Divider";
import { ProductCategoryWithDetails } from "~/models/ProductCategories/types";
import { ProductSubCategoryWithDetails } from "~/models/ProductSubCategories/types";
import Footer from "./Footer";
import Categories from "./Categories";
import TileImages from "./TileImages";
import Navbar from "./Navbar";

type Props = {
  cart: Cart | null;
  departments: DepartmentWithDetails[];
  productCategories: ProductCategoryWithDetails[];
  randomPromotions: PromotionWithContent[];
  searchState: boolean | null;
  setSearchState: React.Dispatch<React.SetStateAction<boolean | null>>;
  user: User | null;
};

export type MegaMenuTypes = "mens" | "womans" | "kids" | "sale";

const ProductMegaMenu = ({
  // departments,
  cart,
  productCategories,
  randomPromotions,
  searchState,
  setSearchState,
  user,
}: Props) => {
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState<MegaMenuTypes | undefined>();

  const [activeCategory, setActiveCategory] = useState<
    ProductCategoryWithDetails | ProductSubCategoryWithDetails
  >();

  return (
    <>
      <button
        type="button"
        className="max-xl:absolute max-xl:left-12 flex h-[60px] flex-row items-center gap-4 px-6 max-md:px-3 font-bold relative left-0"
        onClick={() => navigate("/home")}
      >
        <h1 className="cursor-pointer select-none text-xl font-bold tracking-widest text-brand-white">
          CLUTCH.
        </h1>
      </button>

      <Navbar
        searchState={searchState}
        setSearchState={setSearchState}
        user={user}
        cart={cart}
        setActiveMenu={setActiveMenu}
      />

      <div
        className={`absolute z-50 mt-[60px] pb-6 max-xl:hidden
        bg-brand-black border-2 border-t-0 border-brand-white/5 transition-all duration-500 mb-3 w-full
        ${activeMenu ? "!opacity-1 h-max visible" : "opacity-0 h-0 invisible"}`}
        onMouseLeave={() => setActiveMenu(undefined)}
      >
        {activeMenu && (
          <div className="text-brand-white font-bold mb-6 bg-brand-white/5 py-3 px-12">{`SHOP IN ${activeMenu?.toLocaleUpperCase()}`}</div>
        )}

        <div className="flex justify-between w-full gap-6 px-12">
          <Categories
            activeMenu={activeMenu}
            productCategories={productCategories}
            setActiveCategory={setActiveCategory}
          />

          {activeMenu && (
            <TileImages
              activeCategory={activeCategory}
              activeMenu={activeMenu}
              randomPromotions={randomPromotions}
            />
          )}
        </div>

        <Divider color="white" extendStyle="my-6" />

        <Footer activeMenu={activeMenu} />
      </div>
    </>
  );
};

export default ProductMegaMenu;
