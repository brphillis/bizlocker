import { useSearchParams, useSubmit } from "@remix-run/react";

type Props = {
  productCategories: ProductCategory[];
  brands: Brand[];
  colors: string[];
};

const ProductFilterSideBar = ({ productCategories, brands, colors }: Props) => {
  const [searchParams] = useSearchParams();
  const submit = useSubmit();

  return (
    <ul className="menu hidden w-72 rounded-none bg-base-200/50 xl:block">
      <li>
        <details open>
          <summary className="font-semibold text-brand-black">Gender</summary>
          <ul>
            <li
              onClick={() => {
                searchParams.set("gender", "MALE");
                submit(searchParams, {
                  method: "GET",
                });
              }}
            >
              <p>Men</p>
            </li>
            <li
              onClick={() => {
                searchParams.set("gender", "FEMALE");
                submit(searchParams, {
                  method: "GET",
                });
              }}
            >
              <p>Woman</p>
            </li>
            <li
              onClick={() => {
                searchParams.set("gender", "KIDS");
                submit(searchParams, {
                  method: "GET",
                });
              }}
            >
              <p>Kids</p>
            </li>
          </ul>
        </details>
      </li>
      <div className="my-2 w-full border-b-2 border-brand-black/10" />
      <li>
        <details open>
          <summary className="font-semibold text-brand-black">Category</summary>
          <ul className="max-h-[300px] overflow-y-auto">
            {productCategories?.map(({ id, name }: ProductCategory) => {
              return (
                <li
                  key={"productCategory_sideFilter_" + id}
                  onClick={() => {
                    searchParams.set("productCategory", name);
                    submit(searchParams, {
                      method: "GET",
                    });
                  }}
                >
                  <p>{name}</p>
                </li>
              );
            })}
          </ul>
        </details>
      </li>
      <div className="my-2 w-full border-b-2 border-brand-black/10" />
      <li>
        <details>
          <summary className="font-semibold text-brand-black">Brand</summary>
          <ul className="max-h-[300px] overflow-y-auto">
            {brands?.map(({ id, name }: Brand) => {
              return (
                <li
                  key={"brand_sideFilter_" + id}
                  onClick={() => {
                    searchParams.set("brand", name);
                    submit(searchParams, {
                      method: "GET",
                    });
                  }}
                >
                  <p>{name}</p>
                </li>
              );
            })}
          </ul>
        </details>
      </li>
      <div className="my-2 w-full border-b-2 border-brand-black/10" />
      <li>
        <details>
          <summary className="font-semibold text-brand-black">Color</summary>
          <ul className="max-h-[300px] overflow-y-auto">
            {colors?.map((colorName: string) => {
              return (
                <li key={"color_sideFilter_" + colorName}>
                  <p>{colorName}</p>
                </li>
              );
            })}
          </ul>
        </details>
      </li>
      <div className="my-2 w-full border-b-2 border-brand-black/10" />
      <li>
        <div className="flex cursor-pointer justify-between">
          <span className="label-text mr-6">Sale Only</span>
          <input type="checkbox" className="toggle toggle-sm !self-end" />
        </div>
        <div className="flex cursor-pointer justify-between">
          <span className="label-text mr-6">New Only</span>
          <input type="checkbox" className="toggle toggle-sm !self-end" />
        </div>
      </li>
    </ul>
  );
};

export default ProductFilterSideBar;
