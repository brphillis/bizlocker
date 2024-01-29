import Spinner from "~/components/Spinner";
import { BlockOptions, Product } from "@prisma/client";
import ProductGrid from "~/components/Grids/ProductGrid";
import { BlockContentSorted } from "~/models/Blocks/types";
import Title from "../_BlockComponents/Title";
import Container from "../_BlockComponents/Container";
type Props = {
  content: BlockContentSorted[];
  options: BlockOptions[];
};

const ProductBlock = ({ content, options }: Props) => {
  const { sortBy, columns } = options[0] || {};

  const products = content
    .map((e) => e.product as Product)
    .filter((product) => product !== undefined);

  const productCategory = content[0]?.productCategory;
  const productSubCategory = content[0]?.productSubCategory;
  const brand = content[0]?.brand;
  const gender = content[0]?.gender;

  const determineSortPhrase = (sortBy: SortBy) => {
    if (
      sortBy === "createdAt" &&
      productSubCategory?.name &&
      productCategory?.name &&
      brand?.name.toLowerCase() === "none"
    ) {
      return "SHOP BY NEWEST";
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
      return "SHOP NEW IN ";
    }
    if (sortBy === "totalSold") {
      return "SHOP BEST IN ";
    } else return null;
  };

  const determineDisplayedFilter = () => {
    if (
      brand?.name.toLowerCase() === "generic" &&
      productSubCategory?.name &&
      productCategory?.name &&
      gender
    ) {
      return;
    }

    if (brand?.name && brand?.name.toLowerCase() !== "generic") {
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
        return "WOMANS";
      }
      if (gender === "MALE") {
        return "MENS";
      }
      if (gender === "KIDS") {
        return "KIDS";
      }
      if (gender === "UNISEX") {
        return "ALL RANGES";
      }

      return productCategory?.name;
    }
  };

  const currentTitle =
    (sortBy ? determineSortPhrase(sortBy) : null) +
    (determineDisplayedFilter() || "OUR RANGE");

  return (
    <Container options={options[0]}>
      <>
        {currentTitle && (
          <Title blockOptions={options[0]} otherTitle={currentTitle} />
        )}
      </>

      {products && (
        <ProductGrid
          products={products}
          cols={columns || undefined}
          enablePlaceHolder={true}
          extendStyle="!px-0"
        />
      )}

      <>
        {!products && (
          <div className="flex w-full items-center justify-center">
            <Spinner mode="circle" />
          </div>
        )}
      </>
    </Container>
  );
};

export default ProductBlock;
