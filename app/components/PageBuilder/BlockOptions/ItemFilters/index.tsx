import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster";

type Props = {
  defaultValues?: BlockOptions;
  selectedBlockOptions?: BlockMasterOptions;
  selectedItems: ContentSelection[];
};

const ItemFilterOptions = ({
  defaultValues,
  selectedBlockOptions,
  selectedItems,
}: Props) => {
  const { filter1, filter2, filter3, filter4, filter5, filter6 } =
    defaultValues || {};

  return (
    <details className="collapse !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">
        Item Filters
      </summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        {selectedBlockOptions?.filter1 && selectedItems.length > 0 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 1 Filter</span>
            </label>
            <select
              name="filter1"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Filter"
              defaultValue={!filter1 ? undefined : filter1}
            >
              <option value="">Select a Filter</option>
              <option value=" filter invert ">Invert</option>
              <option value=" filter sepia ">Sepia</option>
              <option value=" filter grayscale ">Grayscale</option>

              <option value=" filter saturate-50 ">Saturate Light</option>
              <option value=" filter saturate-100 ">Saturate</option>
              <option value=" filter saturate-150 ">Saturate Medium</option>
              <option value=" filter saturate-200 ">Saturate Heavy</option>

              <option value=" filter brightness-50 ">Brightness Light</option>
              <option value=" filter brightness-100 ">Brightness</option>
              <option value=" filter brightness-150 ">Brightness Medium</option>
              <option value=" filter brightness-200 ">Brightness Heavy</option>

              <option value=" filter contrast-50 ">Contrast Light</option>
              <option value=" filter contrast-100 ">Contrast</option>
              <option value=" filter contrast-150 ">Contrast Medium</option>
              <option value=" filter contrast-200 ">Contrast Heavy</option>

              <option value=" filter blur-sm ">Blur Light</option>
              <option value=" filter blur ">Blur</option>
              <option value=" blur-md ">Blur Medium</option>
              <option value=" filter blur-lg ">Blur Heavy</option>
            </select>
          </div>
        )}

        {selectedBlockOptions?.filter2 && selectedItems.length > 1 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 2 Filter</span>
            </label>
            <select
              name="filter2"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Filter"
              defaultValue={!filter2 ? undefined : filter2}
            >
              <option value="">Select a Filter</option>
              <option value=" filter invert ">Invert</option>
              <option value=" filter sepia ">Sepia</option>
              <option value=" filter grayscale ">Grayscale</option>

              <option value=" filter saturate-50 ">Saturate Light</option>
              <option value=" filter saturate-100 ">Saturate</option>
              <option value=" filter saturate-150 ">Saturate Medium</option>
              <option value=" filter saturate-200 ">Saturate Heavy</option>

              <option value=" filter brightness-50 ">Brightness Light</option>
              <option value=" filter brightness-100 ">Brightness</option>
              <option value=" filter brightness-150 ">Brightness Medium</option>
              <option value=" filter brightness-200 ">Brightness Heavy</option>

              <option value=" filter contrast-50 ">Contrast Light</option>
              <option value=" filter contrast-100 ">Contrast</option>
              <option value=" filter contrast-150 ">Contrast Medium</option>
              <option value=" filter contrast-200 ">Contrast Heavy</option>

              <option value=" filter blur-sm ">Blur Light</option>
              <option value=" filter blur ">Blur</option>
              <option value=" blur-md ">Blur Medium</option>
              <option value=" filter blur-lg ">Blur Heavy</option>
            </select>
          </div>
        )}

        {selectedBlockOptions?.filter3 && selectedItems.length > 2 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 3 Filter</span>
            </label>
            <select
              name="filter3"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Filter"
              defaultValue={!filter3 ? undefined : filter3}
            >
              <option value="">Select a Filter</option>
              <option value=" filter invert ">Invert</option>
              <option value=" filter sepia ">Sepia</option>
              <option value=" filter grayscale ">Grayscale</option>

              <option value=" filter saturate-50 ">Saturate Light</option>
              <option value=" filter saturate-100 ">Saturate</option>
              <option value=" filter saturate-150 ">Saturate Medium</option>
              <option value=" filter saturate-200 ">Saturate Heavy</option>

              <option value=" filter brightness-50 ">Brightness Light</option>
              <option value=" filter brightness-100 ">Brightness</option>
              <option value=" filter brightness-150 ">Brightness Medium</option>
              <option value=" filter brightness-200 ">Brightness Heavy</option>

              <option value=" filter contrast-50 ">Contrast Light</option>
              <option value=" filter contrast-100 ">Contrast</option>
              <option value=" filter contrast-150 ">Contrast Medium</option>
              <option value=" filter contrast-200 ">Contrast Heavy</option>

              <option value=" filter blur-sm ">Blur Light</option>
              <option value=" filter blur ">Blur</option>
              <option value=" blur-md ">Blur Medium</option>
              <option value=" filter blur-lg ">Blur Heavy</option>
            </select>
          </div>
        )}

        {selectedBlockOptions?.filter4 && selectedItems.length > 3 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 4 Filter</span>
            </label>
            <select
              name="filter4"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Filter"
              defaultValue={!filter4 ? undefined : filter4}
            >
              <option value="">Select a Filter</option>
              <option value=" filter invert ">Invert</option>
              <option value=" filter sepia ">Sepia</option>
              <option value=" filter grayscale ">Grayscale</option>

              <option value=" filter saturate-50 ">Saturate Light</option>
              <option value=" filter saturate-100 ">Saturate</option>
              <option value=" filter saturate-150 ">Saturate Medium</option>
              <option value=" filter saturate-200 ">Saturate Heavy</option>

              <option value=" filter brightness-50 ">Brightness Light</option>
              <option value=" filter brightness-100 ">Brightness</option>
              <option value=" filter brightness-150 ">Brightness Medium</option>
              <option value=" filter brightness-200 ">Brightness Heavy</option>

              <option value=" filter contrast-50 ">Contrast Light</option>
              <option value=" filter contrast-100 ">Contrast</option>
              <option value=" filter contrast-150 ">Contrast Medium</option>
              <option value=" filter contrast-200 ">Contrast Heavy</option>

              <option value=" filter blur-sm ">Blur Light</option>
              <option value=" filter blur ">Blur</option>
              <option value=" blur-md ">Blur Medium</option>
              <option value=" filter blur-lg ">Blur Heavy</option>
            </select>
          </div>
        )}

        {selectedBlockOptions?.filter5 && selectedItems.length > 4 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 5 Filter</span>
            </label>
            <select
              name="filter5"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Filter"
              defaultValue={!filter5 ? undefined : filter5}
            >
              <option value="">Select a Filter</option>
              <option value=" filter invert ">Invert</option>
              <option value=" filter sepia ">Sepia</option>
              <option value=" filter grayscale ">Grayscale</option>

              <option value=" filter saturate-50 ">Saturate Light</option>
              <option value=" filter saturate-100 ">Saturate</option>
              <option value=" filter saturate-150 ">Saturate Medium</option>
              <option value=" filter saturate-200 ">Saturate Heavy</option>

              <option value=" filter brightness-50 ">Brightness Light</option>
              <option value=" filter brightness-100 ">Brightness</option>
              <option value=" filter brightness-150 ">Brightness Medium</option>
              <option value=" filter brightness-200 ">Brightness Heavy</option>

              <option value=" filter contrast-50 ">Contrast Light</option>
              <option value=" filter contrast-100 ">Contrast</option>
              <option value=" filter contrast-150 ">Contrast Medium</option>
              <option value=" filter contrast-200 ">Contrast Heavy</option>

              <option value=" filter blur-sm ">Blur Light</option>
              <option value=" filter blur ">Blur</option>
              <option value=" blur-md ">Blur Medium</option>
              <option value=" filter blur-lg ">Blur Heavy</option>
            </select>
          </div>
        )}

        {selectedBlockOptions?.filter6 && selectedItems.length > 5 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 6 Filter</span>
            </label>
            <select
              name="filter6"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Filter"
              defaultValue={!filter6 ? undefined : filter6}
            >
              <option value="">Select a Filter</option>
              <option value=" filter invert ">Invert</option>
              <option value=" filter sepia ">Sepia</option>
              <option value=" filter grayscale ">Grayscale</option>

              <option value=" filter saturate-50 ">Saturate Light</option>
              <option value=" filter saturate-100 ">Saturate</option>
              <option value=" filter saturate-150 ">Saturate Medium</option>
              <option value=" filter saturate-200 ">Saturate Heavy</option>

              <option value=" filter brightness-50 ">Brightness Light</option>
              <option value=" filter brightness-100 ">Brightness</option>
              <option value=" filter brightness-150 ">Brightness Medium</option>
              <option value=" filter brightness-200 ">Brightness Heavy</option>

              <option value=" filter contrast-50 ">Contrast Light</option>
              <option value=" filter contrast-100 ">Contrast</option>
              <option value=" filter contrast-150 ">Contrast Medium</option>
              <option value=" filter contrast-200 ">Contrast Heavy</option>

              <option value=" filter blur-sm ">Blur Light</option>
              <option value=" filter blur ">Blur</option>
              <option value=" blur-md ">Blur Medium</option>
              <option value=" filter blur-lg ">Blur Heavy</option>
            </select>
          </div>
        )}
      </div>
    </details>
  );
};

export default ItemFilterOptions;
