import { useEffect, useState } from "react";
import { IoRefreshOutline, IoSearch } from "react-icons/io5";
import { Form, useSearchParams, useSubmit } from "react-router-dom";
import SearchInput from "../Forms/Input/SearchInput";

type Props = {
  departments: Department[];
  productCategories: ProductCategory[];
  brands: Brand[];
};

const SearchBar = ({ departments, productCategories, brands }: Props) => {
  const submit = useSubmit();
  const [searchParams] = useSearchParams();

  const searchedDepartment = searchParams.get("department");

  const [, setCategories] = useState<ProductCategory[] | undefined>();
  const [subCategories, setSubCategories] = useState<
    ProductSubCategory[] | undefined
  >(undefined);

  useEffect(() => {
    if (searchedDepartment) {
      const departmentsCategories = productCategories.filter(
        (e) => e.department.name === searchedDepartment
      );
      setCategories(departmentsCategories);
    }
  }, [productCategories, searchedDepartment]);

  return (
    <Form
      method="GET"
      action="/products"
      className="form-control relative mt-[-1px] flex h-max w-full !flex-row justify-center gap-3 bg-brand-black py-3"
    >
      <div className="flex flex-row flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          className="btn-square btn-primary !ml-[85%] flex h-[2.6rem] w-12 items-center justify-center !rounded-sm max-lg:hidden sm:!ml-0"
          onClick={() => {
            searchParams.delete("name");
            searchParams.delete("productCategory");
            searchParams.delete("productSubCategory");
            searchParams.delete("brand");
            searchParams.delete("gender");
          }}
        >
          <IoRefreshOutline />
        </button>

        <div className="flex flex-row gap-3">
          <SearchInput
            name="name"
            placeholder="Search"
            auto={true}
            action="/products"
            styles="!rounded-sm"
          />
        </div>

        <div className="flex flex-row flex-wrap justify-center gap-3">
          <select
            name="department"
            title="department"
            className="select w-[215px] !rounded-sm !font-normal text-brand-black/50 max-lg:w-[95vw]"
            placeholder="Select a Department"
            onChange={(e) => {
              if (e.target.selectedIndex === 0) {
                setSubCategories(undefined);
              } else {
                setCategories(
                  departments[e.target.selectedIndex - 1].productCategories
                );
              }
              searchParams.delete("productCategory");
              searchParams.delete("productSubCategory");
              searchParams.delete("brand");
              searchParams.set("department", e.target.value);
            }}
          >
            <option value="">Department</option>
            {departments?.map(({ id, name }: Department) => {
              return (
                <option key={name + id} value={name}>
                  {name}
                </option>
              );
            })}
          </select>

          <select
            name="productCategory"
            title="category"
            className="select w-[215px] !rounded-sm !font-normal text-brand-black/50 max-lg:w-[95vw]"
            placeholder="Select a Category"
            onChange={(e) => {
              if (e.target.selectedIndex === 0) {
                setSubCategories(undefined);
              } else {
                setSubCategories(
                  productCategories[e.target.selectedIndex - 1]
                    .productSubCategories
                );
              }
              searchParams.delete("productSubCategory");
              searchParams.delete("brand");
              searchParams.set("productCategory", e.target.value);
            }}
          >
            <option value="">By Category</option>
            {productCategories
              .filter(
                (e) =>
                  e.departmentId ===
                  (departments.find(
                    (f: Department) => f.name === searchParams.get("department")
                  )?.id || 1)
              )
              .map(({ id, name }: ProductCategory) => {
                return (
                  <option key={name + id} value={name}>
                    {name}
                  </option>
                );
              })}
          </select>

          {subCategories && subCategories.length > 0 && (
            <select
              name="productSubCategory"
              title="Sub Category"
              className="select w-[215px] !rounded-sm !font-normal text-brand-black/50 max-lg:w-[95vw]"
              placeholder="Select a SubCategory"
              onChange={(e) => {
                searchParams.delete("brand");
                searchParams.set("productSubCategory", e.target.value);
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
            className="select w-[215px] !rounded-sm !font-normal text-brand-black/50 max-lg:w-[95vw]"
            placeholder="Select a Value"
            onChange={(e) => {
              searchParams.set("brand", e.target.value);
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

        <div className="flex w-max items-center justify-between px-0 max-lg:w-full max-lg:px-4">
          <button
            type="button"
            className="btn-square btn-primary hidden h-[2.6rem] w-12 items-center justify-center !rounded-sm max-lg:flex "
            onClick={() => {
              searchParams.delete("name");
              searchParams.delete("productCategory");
              searchParams.delete("productSubCategory");
              searchParams.delete("brand");
              searchParams.delete("gender");
            }}
          >
            <IoRefreshOutline />
          </button>

          <button
            type="button"
            className="btn-square btn-primary flex h-[2.6rem] w-12 items-center justify-center !rounded-sm sm:!ml-0"
            onClick={() => {
              submit(searchParams, {
                method: "GET",
                action: "/products",
              });
            }}
          >
            <IoSearch />
          </button>
        </div>
      </div>
    </Form>
  );
};

export default SearchBar;
