import SelectBrand from "~/components/Forms/Select/SelectBrand";
import SelectProductCategory from "~/components/Forms/Select/SelectProductCategory";
import SelectRootCategory from "~/components/Forms/Select/SelectRootCategory";

type Props = {
  selectedBlock: BlockName | undefined;
  rootCategories: RootCategory[];
  productCategories: ProductCategory[];
  brands: Brand[];
};

const ProductBlockOptions = ({
  selectedBlock,
  rootCategories,
  productCategories,
  brands,
}: Props) => {
  return (
    <>
      {selectedBlock === "product" && (
        <div className=" w-full bg-base-300 px-2 py-3">
          <p className="px-1 pb-3 font-bold">Product Block Filters</p>
          <div className="flex flex-wrap gap-3">
            <SelectRootCategory rootCategories={rootCategories} />

            <SelectProductCategory productCategories={productCategories} />

            <SelectBrand brands={brands} />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductBlockOptions;
