import React from "react";
import ProductCard from "../../Cards/ProductCard";

import ProductSort from "~/components/Sorting/ProductSort";

type Props = {
  products: Product[];
  sort?: boolean;
  totalCount?: number;
};

const ProductGrid = ({ products, sort = true, totalCount }: Props) => {
  return (
    <div className="max-w-screen w-[1280px]">
      {sort && (
        <>
          <ProductSort totalCount={totalCount} />
          <div className="my-3 w-full border-b border-brand-black/20" />
        </>
      )}

      <div className="flex justify-around px-0 py-3">
        <ul className="menu w-72 rounded-none bg-base-200/50">
          <li>
            <details>
              <summary className="font-semibold text-brand-black">
                Gender
              </summary>
              <ul>
                <li>
                  <a>Men</a>
                </li>
                <li>
                  <a>Woman</a>
                </li>
                <li>
                  <a>Kids</a>
                </li>
              </ul>
            </details>
          </li>
          <div className="my-2 w-full border-b-2 border-brand-black/10" />
          <li>
            <details>
              <summary className="font-semibold text-brand-black">
                Category
              </summary>
              <ul>
                <li>
                  <a>level 2 item 1</a>
                </li>
                <li>
                  <a>level 2 item 2</a>
                </li>
              </ul>
            </details>
          </li>
          <div className="my-2 w-full border-b-2 border-brand-black/10" />
          <li>
            <details>
              <summary className="font-semibold text-brand-black">
                Brand
              </summary>
              <ul>
                <li>
                  <a>level 2 item 1</a>
                </li>
                <li>
                  <a>level 2 item 2</a>
                </li>
              </ul>
            </details>
          </li>
          <div className="my-2 w-full border-b-2 border-brand-black/10" />
          <li>
            <details>
              <summary className="font-semibold text-brand-black">
                Color
              </summary>
              <ul>
                <li>
                  <a>level 2 item 1</a>
                </li>
                <li>
                  <a>level 2 item 2</a>
                </li>
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

        <div className="max-w-screen grid gap-3 gap-y-3 md:grid-cols-4 md:gap-6 md:gap-y-6">
          {products?.map((product) => (
            <React.Fragment key={product.id}>
              <ProductCard {...product} />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
