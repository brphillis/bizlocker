import React from "react";
import ProductCard from "../../Cards/ProductCard";

import ProductSort from "~/components/Sorting/ProductSort";

type Props = {
  products: Product[];
  sort?: boolean;
};

const ProductGrid = ({ products, sort = true }: Props) => {
  return (
    <div className="max-w-screen w-[1280px]">
      {sort && <ProductSort />}

      <div className="max-w-screen grid grid-cols-2 gap-3 gap-y-3 px-0 md:grid-cols-4 md:gap-6 md:gap-y-6 md:px-0">
        {products?.map((product) => (
          <React.Fragment key={product.id}>
            <ProductCard {...product} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
