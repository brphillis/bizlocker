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
  const rootCategory = content?.[0]?.rootCategory?.id;
  const productCategory = content?.[0]?.productCategory?.id;
  const brand = content?.[0]?.brand?.id;
  const count = options?.count;

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data == null) {
      let query = "/api/searchProducts";

      const params = [];
      if (rootCategory !== null && rootCategory !== undefined) {
        params.push(`rootCategory=${rootCategory}`);
      }

      if (productCategory !== null && productCategory !== undefined) {
        params.push(`productCategory=${productCategory}`);
      }

      if (brand !== null && brand !== undefined) {
        params.push(`brand=${brand}`);
      }

      if (count !== null && count !== undefined) {
        params.push(`perPage=${count.toString()}`);
      }

      if (params.length > 0) {
        query += `?${params.join("&")}`;
      }

      fetcher.load(query);
    }

    if (fetcher.data && !currentProducts) {
      const { products } = fetcher.data;
      setCurrentProducts(products);
    }
  }, [
    fetcher,
    currentProducts,
    content,
    rootCategory,
    productCategory,
    brand,
    count,
  ]);

  const determineSortPhrase = (sortBy: SortBy) => {
    if (sortBy === "createdAt") {
      return "Shop New In  ";
    }
    if (sortBy === "totalSold") {
      return "Shop Best In  ";
    } else return null;
  };

  const determineDisplayedFilter = (content: ProductBlockContent) => {
    if (content?.brand?.name) {
      return content?.brand?.name;
    }
    if (content?.productCategory?.name) {
      return content?.productCategory?.name;
    }
    if (content?.rootCategory?.name) {
      return content?.rootCategory?.name;
    }
  };

  const columns = options?.columns ? options?.columns : undefined;

  return (
    <>
      <p className="pl-3 text-xl font-bold md:pl-1">
        {options?.sortBy ? determineSortPhrase(options?.sortBy) : null}
        <span className="text-2xl">{determineDisplayedFilter(content[0])}</span>
      </p>

      {currentProducts && (
        <ProductGrid products={currentProducts} cols={columns} />
      )}
    </>
  );
};

export default ProductBlock;
