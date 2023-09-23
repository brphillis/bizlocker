import BasicSelect from "~/components/Forms/Select/BasicSelect";
import SelectGender from "~/components/Forms/Select/SelectGender";

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
              <BasicSelect
                name="productCategory"
                label="Product Category"
                placeholder="Product Category"
                selections={productCategories as unknown as SelectValue[]}
                defaultValue={defaultValues?.[0]?.productCategoryId?.toString()}
              />

              <BasicSelect
                name="productSubCategory"
                label="Product  SubCategory"
                placeholder="Product SubCategory"
                selections={productSubCategories as unknown as SelectValue[]}
                defaultValue={defaultValues?.[0]?.productSubCategoryId?.toString()}
              />
            </div>

            <div className="flex w-full justify-start gap-3">
              <BasicSelect
                name="brand"
                label="Brand"
                placeholder="Brand"
                selections={brands as unknown as SelectValue[]}
                defaultValue={defaultValues?.[0]?.brandId?.toString()}
              />

              <SelectGender
                label="Gender"
                defaultValue={defaultValues?.[0]?.gender?.toString()}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductBlockOptions;
