type Props = {
  defaultValues: BlockOptions;
  selectedBlockOptions: BlockMasterOptions | undefined;
  selectedItems: ContentSelection[];
};

const ItemFilterOptions = ({
  defaultValues,
  selectedBlockOptions,
  selectedItems,
}: Props) => {
  const {
    filterOne,
    filterTwo,
    filterThree,
    filterFour,
    filterFive,
    filterSix,
  } = defaultValues || {};

  return (
    <details className="collapse !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">
        Item Filters
      </summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        {selectedBlockOptions?.filterOne && selectedItems.length > 0 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 1 Filter</span>
            </label>
            <select
              name="filterOne"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Filter"
              defaultValue={!filterOne ? undefined : filterOne}
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

        {selectedBlockOptions?.filterTwo && selectedItems.length > 1 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 2 Filter</span>
            </label>
            <select
              name="filterTwo"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Filter"
              defaultValue={!filterTwo ? undefined : filterTwo}
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

        {selectedBlockOptions?.filterThree && selectedItems.length > 2 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 3 Filter</span>
            </label>
            <select
              name="filterThree"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Filter"
              defaultValue={!filterThree ? undefined : filterThree}
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

        {selectedBlockOptions?.filterFour && selectedItems.length > 3 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 4 Filter</span>
            </label>
            <select
              name="filterFour"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Filter"
              defaultValue={!filterFour ? undefined : filterFour}
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

        {selectedBlockOptions?.filterFive && selectedItems.length > 4 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 5 Filter</span>
            </label>
            <select
              name="filterFive"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Filter"
              defaultValue={!filterFive ? undefined : filterFive}
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

        {selectedBlockOptions?.filterSix && selectedItems.length > 5 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 6 Filter</span>
            </label>
            <select
              name="filterSix"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Filter"
              defaultValue={!filterSix ? undefined : filterSix}
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
