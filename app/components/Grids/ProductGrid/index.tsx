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

      <div className="flex justify-center px-0 py-3">
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
