import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import ProductGrid from "~/components/Grids/ProductGrid";
import Spinner from "~/components/Spinner";

type Props = {
  content: ProductBlockContent[];
  options: BlockOptions;
};

const ProductBlock = ({ content, options }: Props) => {
  const [currentProducts, setCurrentProducts] = useState<Product[]>();
  const fetcher = useFetcher();
  const productCategory = content?.[0]?.productCategory?.id;
  const productSubCategory = content?.[0]?.productSubCategory?.id;
  const brand = content?.[0]?.brand?.id;
  const count = options?.count;

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data == null) {
      let query = "/api/searchProducts";

      const params = [];
      if (productCategory !== null && productCategory !== undefined) {
        params.push(`productCategory=${productCategory}`);
      }

      if (productSubCategory !== null && productSubCategory !== undefined) {
        params.push(`productSubCategory=${productSubCategory}`);
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
    productCategory,
    productSubCategory,
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
    if (content?.productSubCategory?.name) {
      return content?.productSubCategory?.name;
    }
    if (content?.productCategory?.name) {
      return content?.productCategory?.name;
    }
  };

  const columns = options?.columns ? options?.columns : undefined;

  return (
    <>
      <p className="self-start pl-3 text-xl font-bold md:pl-1">
        {options?.sortBy ? determineSortPhrase(options?.sortBy) : null}
        <span className="text-2xl">{determineDisplayedFilter(content[0])}</span>
      </p>

      {currentProducts && (
        <ProductGrid products={currentProducts} cols={columns} />
      )}

      {!currentProducts && (
        <div className="flex w-full items-center justify-center">
          <Spinner />
        </div>
      )}
    </>
  );
};

export default ProductBlock;
