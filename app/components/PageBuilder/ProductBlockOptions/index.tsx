import SelectBrand from "~/components/Forms/Select/SelectBrand";
import SelectProductCategory from "~/components/Forms/Select/SelectProductCategory";
import SelectRootCategory from "~/components/Forms/Select/SelectRootCategory";

type Props = {
  selectedBlock: BlockName | undefined;
  rootCategories: RootCategory[];
  productCategories: ProductCategory[];
  brands: Brand[];
  defaultValues: ProductBlockContent;
};

const ProductBlockOptions = ({
  selectedBlock,
  rootCategories,
  productCategories,
  brands,
  defaultValues,
}: Props) => {
  return (
    <>
      {selectedBlock === "product" && (
        <div className="w-full bg-base-300/50 px-2 pb-3">
          <p className="mb-3 px-1 pt-3 font-semibold text-brand-black">
            Filters
          </p>
          <div className="flex flex-wrap gap-3">
            <SelectRootCategory
              rootCategories={rootCategories}
              defaultValue={defaultValues?.rootCategoryId?.toString()}
            />

            <SelectProductCategory
              productCategories={productCategories}
              defaultValue={defaultValues?.productCategoryId?.toString()}
            />

            <SelectBrand
              brands={brands}
              defaultValue={defaultValues?.brandId?.toString()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductBlockOptions;
