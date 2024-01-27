import { useNavigate } from "@remix-run/react";
import { ProductCategoryWithDetails } from "~/models/ProductCategories/types";
import { MegaMenuTypes } from "..";
import { ProductSubCategoryWithDetails } from "~/models/ProductSubCategories/types";

type Props = {
  productCategories: ProductCategoryWithDetails[];
  activeMenu?: MegaMenuTypes;
  setActiveCategory: React.Dispatch<
    React.SetStateAction<
      ProductCategoryWithDetails | ProductSubCategoryWithDetails | undefined
    >
  >;
};

const Categories = ({
  productCategories,
  activeMenu,
  setActiveCategory,
}: Props) => {
  const navigate = useNavigate();

  const isSelectedGenderCategory = (
    category: ProductSubCategoryWithDetails,
  ): boolean => {
    const categoryGender = category.gender;
    const activeGender = activeMenu;

    if (categoryGender === "UNISEX") {
      return true;
    } else if (categoryGender === "MALE" && activeGender === "mens") {
      return true;
    } else if (categoryGender === "FEMALE" && activeGender === "womans") {
      return true;
    } else if (categoryGender === "KIDS" && activeGender === "kids") {
      return true;
    } else return false;
  };

  const returnQueryString = (
    productCategoryName: string,
    productSubCategoryName?: string,
  ): string => {
    let queryString = `?productCategory=${productCategoryName}`;

    if (productSubCategoryName) {
      queryString += `&productSubCategory=${productSubCategoryName}`;
    }

    if (activeMenu === "sale") {
      queryString += "&onSale=true";
    } else {
      queryString += `&gender=${activeMenu}`;
    }

    return queryString;
  };

  return (
    <div className="flex gap-6">
      {productCategories.map(
        (
          {
            name: categoryName,
            productSubCategories,
          }: ProductCategoryWithDetails,
          index: number,
        ) => {
          return (
            <div key={"megaMenu_productCategory_" + index}>
              <div
                role="button"
                tabIndex={-1}
                className="text-brand-white font-bold cursor-pointer px-3 pb-6"
                onMouseEnter={() => {
                  setActiveCategory(productCategories[index]);
                  console.log(productCategories[index]);
                }}
                onClick={() => {
                  navigate({
                    pathname: "/products",
                    search: returnQueryString(categoryName),
                  });
                }}
                onKeyDown={() => {
                  navigate({
                    pathname: "/products",
                    search: returnQueryString(categoryName),
                  });
                }}
              >
                {categoryName}
              </div>

              {productSubCategories?.map(
                (
                  {
                    name: subCategoryName,
                    displayInNavigation,
                  }: ProductSubCategoryWithDetails,
                  nestedIndex: number,
                ) => {
                  if (
                    isSelectedGenderCategory(
                      productSubCategories[nestedIndex],
                    ) &&
                    displayInNavigation
                  ) {
                    return (
                      <div
                        role="button"
                        tabIndex={0}
                        key={
                          "megaMenu_productSubCategory_" + index + nestedIndex
                        }
                        onMouseEnter={() => {
                          setActiveCategory(productSubCategories[nestedIndex]);
                        }}
                        onClick={() => {
                          navigate({
                            pathname: "/products",
                            search: returnQueryString(
                              categoryName,
                              subCategoryName,
                            ),
                          });
                        }}
                        onKeyDown={() => {
                          navigate({
                            pathname: "/products",
                            search: returnQueryString(
                              categoryName,
                              subCategoryName,
                            ),
                          });
                        }}
                      >
                        <div className="text-brand-white/75 hover:text-brand-white transition-colors duration-300 text-sm pb-3 px-3 cursor-pointer">
                          {subCategoryName}
                        </div>
                      </div>
                    );
                  } else return null;
                },
              )}
            </div>
          );
        },
      )}
    </div>
  );
};

export default Categories;
