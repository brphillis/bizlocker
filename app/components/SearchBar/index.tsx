import { useState } from "react";
import { IoRefreshOutline } from "react-icons/io5";
import { Form, useSearchParams, useSubmit } from "react-router-dom";
import SearchInput from "../Forms/Input/SearchInput";

type Props = {
  rootCategories: RootCategory[];
  brands: Brand[];
};

const SearchBar = ({ rootCategories, brands }: Props) => {
  const [subCategories, setSubCategories] = useState<
    ProductCategory[] | undefined
  >(undefined);

  const [searchParams] = useSearchParams();
  const submit = useSubmit();

  return (
    <Form
      method="GET"
      action="/products"
      className="form-control mt-[-1px] flex h-max w-screen !flex-row justify-center gap-3 bg-brand-black py-3 sm:py-6"
    >
      <div className="flex flex-row flex-wrap justify-center gap-3">
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
            name="rootCategory"
            title="category"
            className=" select w-[95vw] !font-normal text-brand-black/50 sm:w-[215px]"
            placeholder="Select a Value"
            value={searchParams.get("rootCategory") || ""}
            onChange={(e) => {
              if (e.target.selectedIndex === 0) {
                setSubCategories(undefined);
              } else {
                setSubCategories(
                  rootCategories[e.target.selectedIndex - 1].productCategories
                );
              }
              searchParams.set("rootCategory", e.target.value);
              submit(searchParams, {
                method: "GET",
                action: "/products",
              });
            }}
          >
            <option value="">By Category</option>
            {rootCategories?.map(({ id, name }: RootCategory) => {
              return (
                <option key={name + id} value={id}>
                  {name}
                </option>
              );
            })}
          </select>

          {subCategories && (
            <select
              name="productCategory"
              title="Sub Category"
              className=" select w-[95vw] !font-normal text-brand-black/50 sm:w-[215px]"
              placeholder="Select a Value"
              value={searchParams.get("productCategory") || ""}
              onChange={(e) => {
                searchParams.set("productCategory", e.target.value);
                submit(searchParams, {
                  method: "GET",
                  action: "/products",
                });
              }}
            >
              <option value="">By Range</option>
              {subCategories?.map(({ id, name }: ProductCategory) => {
                return (
                  <option key={name + id} value={id}>
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
            className=" select w-[95vw] !font-normal text-brand-black/50 sm:w-[215px]"
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
                <option key={name + id} value={id}>
                  {name}
                </option>
              );
            })}
          </select>
        </div>

        <button
          type="button"
          className="btn-primary btn-square !ml-[85%] flex w-12 items-center justify-center sm:!ml-0"
          onClick={() => {
            searchParams.delete("name");
            searchParams.delete("rootCategory");
            searchParams.delete("productCategory");
            searchParams.delete("brand");
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
