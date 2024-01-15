import type {
  Brand,
  ProductCategory,
  ProductSubCategory,
} from "@prisma/client";
import type { BlockContentWithDetails } from "~/models/blocks.server";
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
  defaultValues: BlockContentWithDetails;
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
    <details className="collapse collapse-plus !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium text-brand-white">
        Product Filters
      </summary>
      <div className="collapse-content relative sm:!px-3">
        {selectedBlock === "product" && (
          <div className="w-full pb-3">
            <div className="flex flex-wrap gap-6">
              <div className="flex w-full flex-wrap justify-start gap-3 empty:hidden">
                <BasicSelect
                  name="productCategory"
                  label="Product Category"
                  labelStyle="text-brand-white"
                  placeholder="Product Category"
                  selections={productCategories as unknown as SelectValue[]}
                  defaultValue={defaultValues?.productCategory?.[0].id?.toString()}
                  onChange={(selectedValue) => {
                    selectItem(
                      "productCategory",
                      parseInt(selectedValue as string),
                    );
                  }}
                />

                <BasicSelect
                  name="productSubCategory"
                  label="Product SubCategory"
                  labelStyle="text-brand-white"
                  placeholder="Product SubCategory"
                  selections={productSubCategories as unknown as SelectValue[]}
                  defaultValue={defaultValues?.productSubCategory?.[0]?.id.toString()}
                  onChange={(selectedValue) =>
                    selectItem(
                      "productSubCategory",
                      parseInt(selectedValue as string),
                    )
                  }
                />

                <BasicSelect
                  name="brand"
                  label="Brand"
                  labelStyle="text-brand-white"
                  placeholder="Brand"
                  selections={brands as unknown as SelectValue[]}
                  defaultValue={defaultValues?.brand?.[0].id.toString()}
                  onChange={(selectedValue) =>
                    selectItem("brand", parseInt(selectedValue as string))
                  }
                />

                <SelectGender
                  label="Gender"
                  labelStyle="text-brand-white"
                  defaultValue={defaultValues?.gender?.[0].toString()}
                  onChange={(selectedValue) =>
                    selectItem("gender", selectedValue as string)
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </details>
  );
};

export default ProductBlockOptions;
