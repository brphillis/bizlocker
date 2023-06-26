import React from "react";
import ProductCard from "../../Cards/ProductCard";

type Props = {
  products: Product[];
};

const ProductGrid = ({ products }: Props) => {
  return (
    <div className="max-w-screen my-6 grid grid-cols-2 gap-3 gap-y-3 px-0 md:grid-cols-4 md:gap-6 md:gap-y-6 md:px-3">
      {products?.map((product) => (
        <React.Fragment key={product.id}>
          <ProductCard {...product} />
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProductGrid;
