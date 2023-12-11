import type {
  Brand,
  ProductCategory,
  ProductSubCategory,
} from "@prisma/client";
import type { BlockContent } from "~/models/blocks.server";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import SelectGender from "~/components/Forms/Select/SelectGender";
import type { BlockContentType, BlockName } from "~/utility/blockMaster/types";

type Props = {
  selectedBlock: BlockName | undefined;
  selectedItems: ContentSelection[];
  setSelectedItems: Function;
  productCategories: ProductCategory[];
  productSubCategories: ProductSubCategory[];
  brands: Brand[] | null;
  defaultValues: BlockContent;
};

const ProductBlockOptions = ({
  selectedItems,
  setSelectedItems,
  selectedBlock,
  productCategories,
  productSubCategories,
  brands,
  defaultValues,
}: Props) => {
  const selectItem = (type: BlockContentType, contentId: number | string) => {
    setSelectedItems((prevSelectedItems: any) => {
      if (!Array.isArray(prevSelectedItems)) {
        prevSelectedItems = [];
      } else {
        prevSelectedItems = prevSelectedItems.filter((e) => e.type !== type);
      }
      return [...prevSelectedItems, { type, contentId }];
    });
  };

  return (
    <>
      {selectedBlock === "product" && (
        <div className="w-full pb-3">
          <p className="mb-3 px-1 pt-3 font-semibold">Filters</p>
          <div className="flex flex-wrap gap-6">
            <div className="flex w-full flex-wrap justify-start gap-3 empty:hidden">
              <BasicSelect
                name="productCategory"
                label="Product Category"
                labelColor="text-brand-white"
                placeholder="Product Category"
                selections={productCategories as unknown as SelectValue[]}
                defaultValue={defaultValues?.productCategoryId?.toString()}
                onChange={(selectedValue) => {
                  selectItem(
                    "productCategory",
                    parseInt(selectedValue as string)
                  );
                }}
              />

              <BasicSelect
                name="productSubCategory"
                label="Product SubCategory"
                labelColor="text-brand-white"
                placeholder="Product SubCategory"
                selections={productSubCategories as unknown as SelectValue[]}
                defaultValue={defaultValues?.productSubCategoryId?.toString()}
                onChange={(selectedValue) =>
                  selectItem(
                    "productSubCategory",
                    parseInt(selectedValue as string)
                  )
                }
              />

              <BasicSelect
                name="brand"
                label="Brand"
                labelColor="text-brand-white"
                placeholder="Brand"
                selections={brands as unknown as SelectValue[]}
                defaultValue={defaultValues?.brandId?.toString()}
                onChange={(selectedValue) =>
                  selectItem("brand", parseInt(selectedValue as string))
                }
              />

              <SelectGender
                label="Gender"
                labelColor="text-brand-white"
                defaultValue={defaultValues?.gender?.toString()}
                onChange={(selectedValue) =>
                  selectItem("gender", selectedValue as string)
                }
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductBlockOptions;
