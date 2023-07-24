import React from "react";
import ProductCard from "../../Cards/ProductCard";
import Pagination from "~/components/Pagination";

type Props = {
  products: Product[];
  totalPages?: number;
  cols?: number;
};

const ProductGrid = ({ products, totalPages, cols }: Props) => {
  return (
    <div className="w-full">
      <div
        style={{
          gridTemplateColumns: cols
            ? `repeat(${cols}, minmax(0, 1fr))`
            : "repeat(4, minmax(0, 1fr))",
        }}
        className="relative grid justify-items-center gap-3 gap-y-3 px-3 pb-3 max-lg:!grid-cols-4 max-md:!grid-cols-3 max-sm:!grid-cols-2 md:gap-6 md:gap-y-6 xl:px-0"
      >
        {products?.map((product) => (
          <React.Fragment key={product.id}>
            <ProductCard {...product} />
          </React.Fragment>
        ))}
      </div>
      {totalPages && <Pagination totalPages={totalPages} />}
    </div>
  );
};

export default ProductGrid;
