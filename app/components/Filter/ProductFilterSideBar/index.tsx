import type {
  Brand,
  Department,
  ProductCategory,
  ProductSubCategory,
} from "@prisma/client";
import { useSearchParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import Divider from "./Divider";
import Toggle from "./Toggle";
import List from "./List";

type Props = {
  departments: Department[] | null;
  productCategories: ProductCategory[] | null;
  productSubCategories: ProductSubCategory[] | null;
  brands: Brand[] | null;
  colors: string[];
};

const ProductFilterSideBar = ({
  departments,
  productCategories,
  productSubCategories,
  brands,
  colors,
}: Props) => {
  const [searchParams] = useSearchParams();

  const [filteredProductCategories, setFilteredProductCategories] = useState<
    ProductCategory[] | null
  >(productCategories);

  const [filteredProductSubCategories, setFilteredProductSubCategories] =
    useState<ProductSubCategory[] | null>(productSubCategories);

  const searchedProductCategory = searchParams.get("productCategory");
  const searchedDepartment = searchParams.get("department");

  const onSaleChecked = searchParams.get("onSale");
  const isPromotedChecked = searchParams.get("isPromoted");
  const isNewOnly = searchParams.get("newOnly");

  const [menuIsExpanded, setMenuIsExpanded] = useState<boolean>(true);

  const handleExpandMenu = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMenuIsExpanded(event.target.checked);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1280px)");

    const handleResize = (
      event: MediaQueryListEvent | MediaQueryListEventInit,
    ) => {
      setMenuIsExpanded(event.matches as boolean);
    };

    handleResize(mediaQuery);

    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  // This effect ensures only children of selected content filters appear for selection
  // Example: you could not select Fridges if Clothing department is active

  useEffect(() => {
    const filterProductCategories = () => {
      const departmentId = departments?.find(
        (e) => e.name === searchedDepartment,
      )?.id;

      if (departmentId && productCategories) {
        const filteredCats = productCategories.filter(
          (e) => e.departmentId === departmentId,
        );
        setFilteredProductCategories(filteredCats);
      } else {
        setFilteredProductCategories(productCategories);
      }
    };

    const filterProductSubCategories = () => {
      const productCategoryId = productCategories?.find(
        (e) => e.name === searchedProductCategory,
      )?.id;

      if (productCategoryId && productSubCategories) {
        const filteredCats = productSubCategories.filter(
          (e) => e.productCategoryId === productCategoryId,
        );
        setFilteredProductSubCategories(filteredCats);
      } else {
        setFilteredProductSubCategories(productSubCategories);
      }
    };

    filterProductCategories();
    filterProductSubCategories();
  }, [
    departments,
    productCategories,
    searchedDepartment,
    productSubCategories,
    searchedProductCategory,
    searchParams,
  ]);

  return (
    <>
      {!menuIsExpanded && (
        <button
          type="button"
          className="mx-3 w-full bg-base-200/50 px-3 py-3 text-center md:w-[720px] lg:w-[968px]"
          onClick={() => setMenuIsExpanded(true)}
        >
          <div className="flex items-center justify-center gap-3 text-sm font-semibold text-brand-black">
            <p>FILTERS</p> <IoChevronDown />
          </div>
        </button>
      )}
      {menuIsExpanded && (
        <ul className="menu collapse mx-3 w-full rounded-none bg-base-200/50 px-3 xl:mx-0 xl:block xl:w-96">
          <div className="collapse-title px-3 py-3 xl:hidden">
            <div className="text-md flex h-[10px] items-center justify-center gap-3 pb-1 font-semibold text-brand-black">
              <p>FILTERS</p> <IoChevronUp />
            </div>
            <div className="my-2 w-full border-b-2 border-brand-black/5" />
          </div>
          <input
            className="absolute top-0 block xl:hidden"
            type="checkbox"
            checked={menuIsExpanded}
            onChange={handleExpandMenu}
          />

          <div className="collapse-content">
            <List
              label="Gender"
              listValues={["Male", "Womans", "Kids"]}
              searchParam="department"
            />

            <Divider />

            {departments && (
              <List
                label="Department"
                listValues={departments?.map((e) => e.name)}
                searchParam="department"
              />
            )}

            <Divider />

            {filteredProductCategories && (
              <List
                label="Category"
                listValues={filteredProductCategories?.map((e) => e.name)}
                searchParam="productCategory"
              />
            )}

            <Divider />

            {filteredProductSubCategories && (
              <List
                label="Sub-Category"
                listValues={filteredProductSubCategories?.map((e) => e.name)}
                searchParam="productSubCategory"
              />
            )}

            <Divider />

            {brands && (
              <List
                label="Brand"
                listValues={brands?.map((e) => e.name)}
                searchParam="brand"
              />
            )}

            <Divider />

            <List label="Color" listValues={colors} searchParam="color" />

            <Divider />

            <li>
              <Toggle
                label="Sale Only"
                isActive={onSaleChecked ? true : false}
                searchParam="onSale"
              />

              <Toggle
                label="Promo Only"
                isActive={isPromotedChecked ? true : false}
                searchParam="isPromoted"
              />

              {/* TODO: IMPLEMENT NEW ONLY FILTER FUNCTIONALITY */}
              <Toggle
                label="New Only"
                isActive={isNewOnly ? true : false}
                searchParam="newOnly"
              />
            </li>
          </div>
        </ul>
      )}
    </>
  );
};

export default ProductFilterSideBar;
