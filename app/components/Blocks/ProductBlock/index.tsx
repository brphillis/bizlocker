import type {
  BlockOptions,
  Brand,
  Product,
  ProductCategory,
  ProductSubCategory,
} from "@prisma/client";
import ProductGrid from "~/components/Grids/ProductGrid";
import Spinner from "~/components/Spinner";
import type { BlockContent } from "~/models/blocks.server";

type Props = {
  content: BlockContent;
  options: BlockOptions[];
};

const ProductBlock = ({ content, options: optionsArray }: Props) => {
  const options = optionsArray[0];
  const products = content?.product as Product[];
  const productSubCategory = content?.productSubCategory as ProductSubCategory;
  const productCategory = content?.productCategory as ProductCategory;
  const brand = content?.brand as Brand;
  const gender = content.gender;

  const determineSortPhrase = (sortBy: SortBy) => {
    if (
      sortBy === "createdAt" &&
      productSubCategory?.name &&
      productCategory?.name &&
      brand?.name.toLowerCase() === "none"
    ) {
      return "Shop by Newest";
    }

    if (
      sortBy === "totalSold" &&
      productSubCategory?.name &&
      productCategory?.name &&
      brand?.name.toLowerCase() === "none"
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

  const determineDisplayedFilter = () => {
    if (
      brand?.name.toLowerCase() === "none" &&
      productSubCategory?.name &&
      productCategory?.name &&
      gender
    ) {
      return;
    }

    if (brand?.name && brand?.name.toLowerCase() !== "none") {
      return brand?.name;
    }
    if (productSubCategory?.name) {
      return productSubCategory?.name;
    }
    if (productCategory?.name) {
      return productCategory?.name;
    }
    if (gender) {
      if (gender === "FEMALE") {
        return "Womans";
      }
      if (gender === "MALE") {
        return "Mens";
      }
      if (gender === "KIDS") {
        return "Kids";
      }
      if (gender === "UNISEX") {
        return "All Ranges";
      }

      return productCategory?.name;
    }
  };

  const columns = options?.columns ? options?.columns : undefined;

  return (
    <>
      <p className="self-start pl-3 text-xl font-bold md:pl-1">
        {options?.sortBy ? determineSortPhrase(options?.sortBy) : null}
        <span className="text-2xl">{determineDisplayedFilter()}</span>
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
