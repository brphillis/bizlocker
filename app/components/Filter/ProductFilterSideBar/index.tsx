import { useSearchParams, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

type Props = {
  rootCategories: RootCategory[];
  productCategories: ProductCategory[];
  brands: Brand[];
  colors: string[];
};

const ProductFilterSideBar = ({
  rootCategories,
  productCategories,
  brands,
  colors,
}: Props) => {
  const [searchParams] = useSearchParams();
  const submit = useSubmit();

  const [filteredProductCategories, setFilteredProductCategories] =
    useState<ProductCategory[]>(productCategories);
  const searchedGender = searchParams.get("gender");
  const searchedRootCat = searchParams.get("rootCategory");
  const searchedProdCat = searchParams.get("productCategory");
  const searchedBrand = searchParams.get("brand");
  const searchedColor = searchParams.get("color");
  const onSaleChecked = searchParams.get("onSale");

  const [menuIsExpanded, setMenuIsExpanded] = useState(true);

  const filterProductCategories = (rootCategoryId: number) => {
    const filteredCats = productCategories.filter(
      (e) => e.rootCategoryId === rootCategoryId
    );

    setFilteredProductCategories(filteredCats);
  };

  const handleExpandMenu = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMenuIsExpanded(event.target.checked);
  };

  useEffect(() => {
    const handleResize = () => {
      const isExpanded = window.innerWidth > 1280;
      setMenuIsExpanded(isExpanded);
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {!menuIsExpanded && (
        <div
          className="mx-3 w-full bg-base-200/50 px-3 py-3 text-center md:w-[720px] lg:w-[968px]"
          onClick={() => setMenuIsExpanded(true)}
        >
          <div className="flex items-center justify-center gap-3 text-sm font-semibold text-brand-black">
            <p>FILTERS</p> <IoChevronDown />
          </div>
        </div>
      )}
      {menuIsExpanded && (
        <ul className="menu collapse mx-3 w-full rounded-none bg-base-200/50 px-0 xl:mx-0 xl:block xl:w-96">
          <div className="collapse-title px-3 py-3 xl:hidden">
            <div className="text-md flex items-center justify-center gap-3 font-semibold text-brand-black">
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
            <li>
              <details
                open
                onClick={(e) => searchedGender && e.preventDefault()}
              >
                <summary
                  className={`font-semibold text-brand-black 
            ${searchedGender && "after:hidden"}`}
                >
                  Gender
                </summary>
                <div
                  className="ml-3 flex cursor-pointer gap-2 py-1 pt-3"
                  onClick={() => {
                    const selectedGender = searchedGender;
                    if (selectedGender === "MALE") {
                      searchParams.delete("gender");
                    } else {
                      searchParams.set("gender", "MALE");
                    }
                    submit(searchParams, {
                      method: "GET",
                      preventScrollReset: true,
                    });
                  }}
                >
                  <input
                    id={"checkBox_productCategory_MENS"}
                    type="checkbox"
                    checked={searchedGender === "MALE"}
                    className="checkbox checkbox-xs"
                    readOnly
                  />
                  <p>Mens</p>
                </div>
                <div
                  className="ml-3 flex cursor-pointer gap-2 py-1 pt-3"
                  onClick={() => {
                    const selectedGender = searchedGender;
                    if (selectedGender === "FEMALE") {
                      searchParams.delete("gender");
                    } else {
                      searchParams.set("gender", "FEMALE");
                    }
                    submit(searchParams, {
                      method: "GET",
                      preventScrollReset: true,
                    });
                  }}
                >
                  <input
                    id={"checkBox_productCategory_FEMALE"}
                    type="checkbox"
                    checked={searchedGender === "FEMALE"}
                    className="checkbox checkbox-xs"
                    readOnly
                  />
                  <p>Womans</p>
                </div>
                <div
                  className="ml-3 flex cursor-pointer gap-2 py-1 pt-3"
                  onClick={() => {
                    const selectedGender = searchedGender;
                    if (selectedGender === "KIDS") {
                      searchParams.delete("gender");
                    } else {
                      searchParams.set("gender", "KIDS");
                    }
                    submit(searchParams, {
                      method: "GET",
                      preventScrollReset: true,
                    });
                  }}
                >
                  <input
                    id={"checkBox_productCategory_KIDS"}
                    type="checkbox"
                    checked={searchedGender === "KIDS"}
                    className="checkbox checkbox-xs"
                    readOnly
                  />
                  <p>Kids</p>
                </div>
              </details>
            </li>
            <div className="my-2 w-full border-b-2 border-brand-black/5" />
            <li>
              <details
                open
                onClick={(e) => searchedProdCat && e.preventDefault()}
              >
                <summary className="font-semibold text-brand-black">
                  Category
                </summary>
                <div className="max-h-[300px] overflow-y-auto">
                  {rootCategories?.map(({ id, name }: RootCategory) => {
                    return (
                      <div
                        key={"rootCategory_sideFilter_" + id}
                        className="ml-3 flex cursor-pointer gap-2 py-1 pt-3"
                        onClick={() => {
                          filterProductCategories(id);
                          searchParams.delete("productCategory");
                          const selectedRootCategory = searchedRootCat;
                          if (selectedRootCategory === name) {
                            searchParams.delete("rootCategory");
                          } else {
                            searchParams.set("rootCategory", name);
                          }
                          submit(searchParams, {
                            method: "GET",
                            preventScrollReset: true,
                          });
                        }}
                      >
                        <input
                          id={"checkBox_rootCategory_" + name}
                          type="checkbox"
                          checked={searchedRootCat === name}
                          className="checkbox checkbox-xs"
                          readOnly
                        />
                        <p>{name}</p>
                      </div>
                    );
                  })}
                </div>
              </details>
            </li>
            <div className="my-2 w-full border-b-2 border-brand-black/5" />
            <li>
              <details
                open
                onClick={(e) => searchedProdCat && e.preventDefault()}
              >
                <summary className="font-semibold text-brand-black">
                  Sub-Category
                </summary>
                <div className="max-h-[300px] overflow-y-auto">
                  {filteredProductCategories?.map(
                    ({ id, name }: ProductCategory) => {
                      return (
                        <div
                          key={"productCategory_sideFilter_" + id}
                          className="ml-3 flex cursor-pointer gap-2 py-1 pt-3"
                          onClick={() => {
                            const selectedProductCategory = searchedProdCat;
                            if (selectedProductCategory === name) {
                              searchParams.delete("productCategory");
                            } else {
                              searchParams.set("productCategory", name);
                            }
                            submit(searchParams, {
                              method: "GET",
                              preventScrollReset: true,
                            });
                          }}
                        >
                          <input
                            id={"checkBox_productCategory_" + name}
                            type="checkbox"
                            checked={searchedProdCat === name}
                            className="checkbox checkbox-xs"
                            readOnly
                          />
                          <p>{name}</p>
                        </div>
                      );
                    }
                  )}
                </div>
              </details>
            </li>
            <div className="my-2 w-full border-b-2 border-brand-black/5" />
            <li>
              <details onClick={(e) => searchedBrand && e.preventDefault()}>
                <summary className="font-semibold text-brand-black">
                  Brand
                </summary>
                <div className="max-h-[300px] overflow-y-auto">
                  {brands?.map(({ id, name }: Brand) => {
                    return (
                      <div
                        key={"brand_sideFilter_" + id}
                        className="ml-3 flex cursor-pointer gap-2 py-1 pt-3"
                        onClick={() => {
                          const selectedBrand = searchedBrand;
                          if (selectedBrand === name) {
                            searchParams.delete("brand");
                          } else {
                            searchParams.set("brand", name);
                          }
                          submit(searchParams, {
                            method: "GET",
                            preventScrollReset: true,
                          });
                        }}
                      >
                        <input
                          id={"checkBox_brand_" + name}
                          type="checkbox"
                          checked={searchedBrand === name}
                          className="checkbox checkbox-xs"
                          readOnly
                        />
                        <p>{name}</p>
                      </div>
                    );
                  })}
                </div>
              </details>
            </li>
            <div className="my-2 w-full border-b-2 border-brand-black/5" />
            <li>
              <details onClick={(e) => searchedColor && e.preventDefault()}>
                <summary className="font-semibold text-brand-black">
                  Color
                </summary>
                <div className="max-h-[300px] overflow-y-auto">
                  {colors?.map((colorName: string) => {
                    return (
                      <div
                        key={"color_sideFilter_" + colorName}
                        className="ml-3 flex cursor-pointer gap-2 py-1 pt-3"
                        onClick={() => {
                          const selectedColor = searchedColor;
                          if (selectedColor === colorName) {
                            searchParams.delete("color");
                          } else {
                            searchParams.set("color", colorName);
                          }
                          submit(searchParams, {
                            method: "GET",
                            preventScrollReset: true,
                          });
                        }}
                      >
                        <input
                          id={"checkBox_brand_" + colorName}
                          type="checkbox"
                          checked={searchedColor === colorName}
                          className="checkbox checkbox-xs"
                          readOnly
                        />
                        <p>{colorName}</p>
                      </div>
                    );
                  })}
                </div>
              </details>
            </li>
            <div className="my-2 w-full border-b-2 border-brand-black/5" />
            <li>
              <div
                className="flex cursor-pointer justify-between"
                onClick={() => {
                  if (onSaleChecked) {
                    searchParams.delete("onSale");
                  } else {
                    searchParams.set("onSale", "true");
                  }
                  submit(searchParams, {
                    method: "GET",
                    preventScrollReset: true,
                  });
                }}
              >
                <span className="label-text mr-6">Sale Only</span>
                <input
                  type="checkbox"
                  className="toggle toggle-sm !self-end"
                  checked={onSaleChecked ? true : false}
                  readOnly
                />
              </div>
              <div className="flex cursor-pointer justify-between">
                <span className="label-text mr-6">New Only</span>
                <input type="checkbox" className="toggle toggle-sm !self-end" />
              </div>
            </li>
          </div>
        </ul>
      )}
    </>
  );
};

export default ProductFilterSideBar;
