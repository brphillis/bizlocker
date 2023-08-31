import { useState } from "react";
import { IoRefreshOutline } from "react-icons/io5";
import { Form, useSearchParams, useSubmit } from "react-router-dom";
import SearchInput from "../Forms/Input/SearchInput";

type Props = {
  productCategories: ProductCategory[];
  brands: Brand[];
};

const SearchBar = ({ productCategories, brands }: Props) => {
  const [subCategories, setSubCategories] = useState<
    ProductSubCategory[] | undefined
  >(undefined);

  const [searchParams] = useSearchParams();
  const submit = useSubmit();

  return (
    <Form
      method="GET"
      action="/products"
      className="form-control relative mt-[-1px] flex h-max w-full !flex-row justify-center gap-3 bg-brand-black py-3"
    >
      <div className="flex flex-row flex-wrap items-center justify-center gap-3">
        <div className="flex flex-row gap-3">
          <SearchInput
            name="name"
            placeholder="Search"
            auto={true}
            action="/products"
          />
        </div>

        <div className="flex flex-row flex-wrap justify-center gap-3">
          <select
            name="productCategory"
            title="category"
            className="select max-h-[1rem] w-[95vw] !font-normal text-brand-black/50 sm:w-[215px]"
            placeholder="Select a Value"
            value={searchParams.get("productCategory") || ""}
            onChange={(e) => {
              if (e.target.selectedIndex === 0) {
                setSubCategories(undefined);
              } else {
                setSubCategories(
                  productCategories[e.target.selectedIndex - 1]
                    .productSubCategories
                );
              }
              searchParams.set("productCategory", e.target.value);
              submit(searchParams, {
                method: "GET",
                action: "/products",
              });
            }}
          >
            <option value="">By Category</option>
            {productCategories?.map(({ id, name }: ProductCategory) => {
              return (
                <option key={name + id} value={name}>
                  {name}
                </option>
              );
            })}
          </select>

          {subCategories && (
            <select
              name="productSubCategory"
              title="Sub Category"
              className="select w-[95vw] !font-normal text-brand-black/50 sm:w-[215px]"
              placeholder="Select a Value"
              value={searchParams.get("productSubCategory") || ""}
              onChange={(e) => {
                searchParams.set("productSubCategory", e.target.value);
                submit(searchParams, {
                  method: "GET",
                  action: "/products",
                });
              }}
            >
              <option value="">By Range</option>
              {subCategories?.map(({ id, name }: ProductSubCategory) => {
                return (
                  <option key={name + id} value={name}>
                    {name}
                  </option>
                );
              })}
            </select>
          )}
        </div>

        <div className="flex flex-row gap-3">
          <select
            name="brand"
            title="brand"
            className="select w-[95vw] !font-normal text-brand-black/50 sm:w-[215px]"
            placeholder="Select a Value"
            value={searchParams.get("brand") || ""}
            onChange={(e) => {
              searchParams.set("brand", e.target.value);
              submit(searchParams, {
                method: "GET",
                action: "/products",
              });
            }}
          >
            <option value="">By Brand</option>
            {brands?.map(({ id, name }: Brand) => {
              return (
                <option key={name + id} value={name}>
                  {name}
                </option>
              );
            })}
          </select>
        </div>

        <button
          type="button"
          className="btn-square btn-primary !ml-[85%] flex h-[2.6rem] w-12 items-center justify-center sm:!ml-0"
          onClick={() => {
            searchParams.delete("name");
            searchParams.delete("productCategory");
            searchParams.delete("productSubCategory");
            searchParams.delete("brand");
            searchParams.delete("gender");
            submit(searchParams, {
              method: "GET",
              action: "/products",
            });
          }}
        >
          <IoRefreshOutline />
        </button>
      </div>
    </Form>
  );
};

export default SearchBar;
