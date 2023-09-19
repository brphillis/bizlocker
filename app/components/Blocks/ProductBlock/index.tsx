// import { useFetcher } from "@remix-run/react";
// import { useEffect, useState } from "react";
import ProductGrid from "~/components/Grids/ProductGrid";
import Spinner from "~/components/Spinner";

type Props = {
  content: ProductBlockContent[];
  options: BlockOptions;
  products: Product[] | undefined;
};

const ProductBlock = ({ content, options, products }: Props) => {
  const determineSortPhrase = (sortBy: SortBy) => {
    if (
      sortBy === "createdAt" &&
      !content?.[0]?.productSubCategory?.name &&
      !content?.[0]?.productCategory?.name &&
      content?.[0]?.brand?.name.toLowerCase() === "none"
    ) {
      return "Shop by Newest";
    }

    if (
      sortBy === "totalSold" &&
      !content?.[0]?.productSubCategory?.name &&
      !content?.[0]?.productCategory?.name &&
      content?.[0]?.brand?.name.toLowerCase() === "none"
    ) {
      return "Shop by Most Popular";
    }

    if (sortBy === "createdAt") {
      return "Shop New In  ";
    }
    if (sortBy === "totalSold") {
      return "Shop Best In  ";
    } else return null;
  };

  const determineDisplayedFilter = (content: ProductBlockContent) => {
    if (
      content?.brand?.name.toLowerCase() === "none" &&
      !content?.productSubCategory?.name &&
      !content?.productCategory?.name &&
      !content?.gender
    ) {
      return;
    }

    if (content?.brand?.name && content?.brand?.name.toLowerCase() !== "none") {
      return content?.brand?.name;
    }
    if (content?.productSubCategory?.name) {
      return content?.productSubCategory?.name;
    }
    if (content?.productCategory?.name) {
      return content?.productCategory?.name;
    }
    if (content?.gender) {
      if (content?.gender === "FEMALE") {
        return "Womans";
      }
      if (content?.gender === "MALE") {
        return "Mens";
      }
      if (content?.gender === "KIDS") {
        return "Kids";
      }
      if (content?.gender === "UNISEX") {
        return "All Ranges";
      }

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

      {products && (
        <ProductGrid
          products={products}
          cols={columns}
          enablePlaceHolder={true}
        />
      )}

      {!products && (
        <div className="flex w-full items-center justify-center">
          <Spinner mode="circle" />
        </div>
      )}
    </>
  );
};

export default ProductBlock;
