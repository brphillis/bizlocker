import SelectBrand from "~/components/Forms/Select/SelectBrand";
import SelectGender from "~/components/Forms/Select/SelectGender";
import SelectProductCategory from "~/components/Forms/Select/SelectProductCategory";
import SelectProductSubCategory from "~/components/Forms/Select/SelectProductSubCategory";

type Props = {
  selectedBlock: BlockName | undefined;
  productCategories: ProductCategory[];
  productSubCategories: ProductSubCategory[];
  brands: Brand[];
  defaultValues: ProductBlockContent[];
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
        <div className="w-full pb-3">
          <p className="mb-3 px-1 pt-3 font-semibold text-brand-white">
            Filters
          </p>
          <div className="flex flex-wrap gap-3 !text-brand-white">
            <div className="flex w-full justify-start gap-3">
              <SelectProductCategory
                productCategories={productCategories}
                defaultValue={defaultValues?.[0].productCategoryId?.toString()}
              />

              <SelectProductSubCategory
                productSubCategories={productSubCategories}
                defaultValue={defaultValues?.[0].productSubCategoryId?.toString()}
              />
            </div>

            <div className="flex w-full justify-start gap-3">
              <SelectBrand
                brands={brands}
                defaultValue={defaultValues?.[0].brandId?.toString()}
              />

              <SelectGender
                label="Gender"
                defaultValue={defaultValues?.[0].gender?.toString()}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductBlockOptions;
