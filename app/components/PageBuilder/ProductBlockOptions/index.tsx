import SelectBrand from "~/components/Forms/Select/SelectBrand";
import SelectProductCategory from "~/components/Forms/Select/SelectProductCategory";
import SelectProductSubCategory from "~/components/Forms/Select/SelectProductSubCategory";

type Props = {
  selectedBlock: BlockName | undefined;
  productCategories: ProductCategory[];
  productSubCategories: ProductSubCategory[];
  brands: Brand[];
  defaultValues: ProductBlockContent;
};

const ProductBlockOptions = ({
  selectedBlock,
  productCategories,
  productSubCategories,
  brands,
  defaultValues,
}: Props) => {
  return (
    <>
      {selectedBlock === "product" && (
        <div className="w-full px-2 pb-3">
          <p className="mb-3 px-1 pt-3 font-semibold text-brand-white">
            Filters
          </p>
          <div className="flex flex-wrap gap-3 !text-brand-white">
            <SelectProductCategory
              productCategories={productCategories}
              defaultValue={defaultValues?.subProductCategoryId?.toString()}
            />

            <SelectProductSubCategory
              productSubCategories={productSubCategories}
              defaultValue={defaultValues?.productSubCategoryId?.toString()}
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
