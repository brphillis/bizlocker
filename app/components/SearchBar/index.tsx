import { useState } from "react";
import { IoRefreshOutline } from "react-icons/io5";
import { Form, useSearchParams, useSubmit } from "react-router-dom";

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
      className="form-control mt-[-1px] flex h-max w-screen !flex-row justify-center gap-3 bg-base-300 py-3 sm:py-6"
    >
      <div className="flex flex-row flex-wrap justify-center gap-3">
        <div className="flex flex-row gap-3">
          <input
            type="text"
            placeholder="by name"
            name="name"
            className="input-bordered input w-[95vw] placeholder:text-sm placeholder:!font-normal placeholder:text-primary-content/50 sm:w-[215px]"
            value={searchParams.get("name") || ""}
            onChange={(e) => {
              searchParams.set("name", e.target.value);
              submit(searchParams, {
                method: "GET",
                action: "/products",
              });
            }}
          />
        </div>

        <div className="flex flex-row flex-wrap justify-center gap-3">
          <select
            name="rootCategory"
            title="category"
            className="select-bordered select w-[95vw] !font-normal text-primary-content/50 sm:w-[215px]"
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
            <option value="">by category</option>
            {rootCategories?.map(({ id, name }: RootCategory) => {
              return (
                <option key={name + id} value={name}>
                  {name}
                </option>
              );
            })}
          </select>

          {subCategories && (
            <select
              name="productCategory"
              title="Sub Category"
              className="select-bordered select w-[95vw] !font-normal text-primary-content/50 sm:w-[215px]"
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
              <option value="">by range</option>
              {subCategories?.map(({ id, name }: ProductCategory) => {
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
            className="select-bordered select w-[95vw] !font-normal text-primary-content/50 sm:w-[215px]"
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
            <option value="">by brand</option>
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

        {/* <button className="btn-outline btn" type="submit">
            search
          </button> */}
      </div>
    </Form>
  );
};

export default SearchBar;
