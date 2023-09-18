import { useSearchParams, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

type Props = {
  departments: Department[];
  productCategories: ProductCategory[];
  productSubCategories: ProductSubCategory[];
  brands: Brand[];
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
  const submit = useSubmit();

  const [filteredProductCategories, setFilteredProductCategories] =
    useState<ProductCategory[]>(productCategories);

  const [filteredProductSubCategories, setFilteredProductSubCategories] =
    useState<ProductSubCategory[]>(productSubCategories);

  const searchedGender = searchParams.get("gender");
  const searchedDepartment = searchParams.get("department");
  const searchedRootCat = searchParams.get("productCategory");
  const searchedProdCat = searchParams.get("productSubCategory");
  const searchedBrand = searchParams.get("brand");
  const searchedColor = searchParams.get("color");
  const onSaleChecked = searchParams.get("onSale");
  const isPromotedChecked = searchParams.get("isPromoted");

  const [menuIsExpanded, setMenuIsExpanded] = useState<boolean>(true);

  const filterProductCategories = (departmentId?: number) => {
    if (departmentId) {
      const filteredCats = productCategories.filter(
        (e) => e.department.id === departmentId
      );
      setFilteredProductCategories(filteredCats);
    } else {
      setFilteredProductCategories(productCategories);
    }
  };

  const filterProductSubCategories = (productCategoryId?: number) => {
    if (productCategoryId) {
      const filteredCats = productSubCategories.filter(
        (e) => e.productCategory?.id === productCategoryId
      );
      setFilteredProductSubCategories(filteredCats);
    } else {
      setFilteredProductSubCategories(productSubCategories);
    }
  };

  const handleExpandMenu = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMenuIsExpanded(event.target.checked);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1280px)");

    const handleResize = (
      event: MediaQueryListEvent | MediaQueryListEventInit
    ) => {
      setMenuIsExpanded(event.matches as boolean);
    };

    handleResize(mediaQuery);

    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
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
                    id="checkBox_productSubCategory_MENS"
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
                    id="checkBox_productSubCategory_FEMALE"
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
                    id="checkBox_productSubCategory_KIDS"
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
                onClick={(e) => searchedDepartment && e.preventDefault()}
              >
                <summary className="font-semibold text-brand-black">
                  Department
                </summary>
                <div className="max-h-[300px] overflow-y-auto">
                  {departments?.map(({ id, name }: Department) => {
                    return (
                      <div
                        key={"department_sideFilter_" + id}
                        className="ml-3 flex cursor-pointer gap-2 py-1 pt-3"
                        onClick={() => {
                          searchParams.delete("productCategory");
                          const selectedDepartment = searchedDepartment;
                          if (selectedDepartment === name) {
                            filterProductCategories();
                            searchParams.delete("department");
                          } else {
                            filterProductCategories(id);
                            searchParams.set("department", name);
                          }
                          submit(searchParams, {
                            method: "GET",
                            preventScrollReset: true,
                          });
                        }}
                      >
                        <input
                          id={"checkBox_department_" + name}
                          type="checkbox"
                          checked={searchedDepartment === name}
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
                  Category
                </summary>
                <div className="max-h-[300px] overflow-y-auto">
                  {filteredProductCategories?.map(
                    ({ id, name }: ProductCategory) => {
                      return (
                        <div
                          key={"productCategory_sideFilter_" + id}
                          className="ml-3 flex cursor-pointer gap-2 py-1 pt-3"
                          onClick={() => {
                            searchParams.delete("productSubCategory");
                            const selectedProductCategory = searchedRootCat;
                            if (selectedProductCategory === name) {
                              filterProductSubCategories();
                              searchParams.delete("productCategory");
                            } else {
                              filterProductSubCategories(id);
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
                            checked={searchedRootCat === name}
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
              <details
                open
                onClick={(e) => searchedProdCat && e.preventDefault()}
              >
                <summary className="font-semibold text-brand-black">
                  Sub-Category
                </summary>
                <div className="max-h-[300px] overflow-y-auto">
                  {filteredProductSubCategories?.map(
                    ({ id, name }: ProductSubCategory) => {
                      return (
                        <div
                          key={"productSubCategory_sideFilter_" + id}
                          className="ml-3 flex cursor-pointer gap-2 py-1 pt-3"
                          onClick={() => {
                            const selectedProductSubCategory = searchedProdCat;
                            if (selectedProductSubCategory === name) {
                              searchParams.delete("productSubCategory");
                            } else {
                              searchParams.set("productSubCategory", name);
                            }
                            submit(searchParams, {
                              method: "GET",
                              preventScrollReset: true,
                            });
                          }}
                        >
                          <input
                            id={"checkBox_productSubCategory_" + name}
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

              <div
                className="flex cursor-pointer justify-between"
                onClick={() => {
                  if (isPromotedChecked) {
                    searchParams.delete("isPromoted");
                  } else {
                    searchParams.set("isPromoted", "true");
                  }
                  submit(searchParams, {
                    method: "GET",
                    preventScrollReset: true,
                  });
                }}
              >
                <span className="label-text mr-6">Promo Only</span>
                <input
                  type="checkbox"
                  className="toggle toggle-sm !self-end"
                  checked={isPromotedChecked ? true : false}
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
