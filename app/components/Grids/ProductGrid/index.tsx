import React from "react";
import ProductCard from "../../Cards/ProductCard";
import Pagination from "~/components/Pagination";

type Props = {
  products: Product[];
  totalPages: number;
};

const ProductGrid = ({ products, totalPages }: Props) => {
  return (
    <div>
      <div className="relative grid grid-cols-2 justify-items-center gap-3 gap-y-3 sm:grid-cols-3 md:gap-6 md:gap-y-6 lg:grid-cols-4">
        {products?.map((product) => (
          <React.Fragment key={product.id}>
            <ProductCard {...product} />
          </React.Fragment>
        ))}
      </div>
      <Pagination totalPages={totalPages} />
    </div>
  );
};

export default ProductGrid;
