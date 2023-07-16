import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import ProductGrid from "~/components/Grids/ProductGrid";

type Props = {
  content: ProductBlockContent[];
  options: BlockOptions;
};

const ProductBlock = ({ content, options }: Props) => {
  const [currentProducts, setCurrentProducts] = useState<Product[]>();
  const fetcher = useFetcher();
  const rootCategory = content?.[0]?.rootCategory?.name;
  const productCategory = content?.[0]?.productCategory?.name;

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data == null) {
      fetcher.load(
        `/api/searchProducts?rootCategory=${rootCategory}&productCategory=${productCategory}`
      );
    }
    if (fetcher.data && !currentProducts) {
      const { products } = fetcher.data;
      setCurrentProducts(products);
    }
    console.log(fetcher);
    console.log("cont", content);
  }, [fetcher, currentProducts, content, rootCategory, productCategory]);

  return (
    <>
      {currentProducts && (
        <ProductGrid products={currentProducts} sort={false} />
      )}
    </>
  );
};

export default ProductBlock;
