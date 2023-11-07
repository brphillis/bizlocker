type Props = {
  defaultValues: BlockOptions;
  colors: string[];
  selectedBlockOptions: BlockMasterOptions | undefined;
  selectedItems: ContentSelection[];
};

const ItemColorOptions = ({
  defaultValues,
  colors,
  selectedBlockOptions,
  selectedItems,
}: Props) => {
  const {
    itemColor,
    itemSecondaryColor,
    color1,
    color2,
    color3,
    color4,
    color5,
    color6,
    colorSecondary1,
    colorSecondary2,
    colorSecondary3,
    colorSecondary4,
    colorSecondary5,
    colorSecondary6,
  } = defaultValues || {};

  return (
    <details className="collapse !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">
        Item Colors
      </summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        {selectedBlockOptions?.itemColor && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item Color</span>
            </label>
            <select
              name="itemColor"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Color"
              defaultValue={!itemColor ? undefined : itemColor}
            >
              <option value="">Select a Color</option>
              {colors?.map((color: string, i: number) => {
                return (
                  <option key={color + i} value={color}>
                    {color}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {selectedBlockOptions?.itemSecondaryColor && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">
                Item Secondary Color
              </span>
            </label>
            <select
              name="itemSecondaryColor"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Color"
              defaultValue={
                !itemSecondaryColor ? undefined : itemSecondaryColor
              }
            >
              <option value="">Select a Color</option>
              {colors?.map((color: string, i: number) => {
                return (
                  <option key={color + i} value={color}>
                    {color}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {selectedBlockOptions?.color1 && selectedItems.length > 0 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 1 Color</span>
            </label>
            <select
              name="color1"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Color"
              defaultValue={!color1 ? undefined : color1}
            >
              <option value="">Select a Color</option>
              {colors?.map((color: string, i: number) => {
                return (
                  <option key={color + i} value={color}>
                    {color}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {selectedBlockOptions?.colorSecondary1 && selectedItems.length > 0 && (
          <div className="form-control w-[50%] max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">
                Item 1 Secondary Color
              </span>
            </label>
            <select
              name="colorSecondary1"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Color"
              defaultValue={!colorSecondary1 ? undefined : colorSecondary1}
            >
              <option value="">Select a Color</option>
              {colors?.map((color: string, i: number) => {
                return (
                  <option key={color + i} value={color}>
                    {color}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {selectedBlockOptions?.color2 && selectedItems.length > 1 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 2 Color</span>
            </label>
            <select
              name="color2"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Color"
              defaultValue={!color2 ? undefined : color2}
            >
              <option value="">Select a Color</option>
              {colors?.map((color: string, i: number) => {
                return (
                  <option key={color + i} value={color}>
                    {color}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {selectedBlockOptions?.colorSecondary2 && selectedItems.length > 1 && (
          <div className="form-control w-[50%] max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">
                Item 2 Secondary Color
              </span>
            </label>
            <select
              name="colorSecondary2"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Color"
              defaultValue={!colorSecondary2 ? undefined : colorSecondary2}
            >
              <option value="">Select a Color</option>
              {colors?.map((color: string, i: number) => {
                return (
                  <option key={color + i} value={color}>
                    {color}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {selectedBlockOptions?.color3 && selectedItems.length > 2 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 3 Color</span>
            </label>
            <select
              name="color3"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Color"
              defaultValue={!color3 ? undefined : color3}
            >
              <option value="">Select a Color</option>
              {colors?.map((color: string, i: number) => {
                return (
                  <option key={color + i} value={color}>
                    {color}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {selectedBlockOptions?.colorSecondary3 && selectedItems.length > 2 && (
          <div className="form-control w-[50%] max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">
                Item 3 Secondary Color
              </span>
            </label>
            <select
              name="colorSecondary3"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Color"
              defaultValue={!colorSecondary3 ? undefined : colorSecondary3}
            >
              <option value="">Select a Color</option>
              {colors?.map((color: string, i: number) => {
                return (
                  <option key={color + i} value={color}>
                    {color}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {selectedBlockOptions?.color4 && selectedItems.length > 3 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 4 Color</span>
            </label>
            <select
              name="color4"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Color"
              defaultValue={!color4 ? undefined : color4}
            >
              <option value="">Select a Color</option>
              {colors?.map((color: string, i: number) => {
                return (
                  <option key={color + i} value={color}>
                    {color}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {selectedBlockOptions?.colorSecondary4 && selectedItems.length > 3 && (
          <div className="form-control w-[50%] max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">
                Item 4 Secondary Color
              </span>
            </label>
            <select
              name="colorSecondary4"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Color"
              defaultValue={!colorSecondary4 ? undefined : colorSecondary4}
            >
              <option value="">Select a Color</option>
              {colors?.map((color: string, i: number) => {
                return (
                  <option key={color + i} value={color}>
                    {color}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {selectedBlockOptions?.color5 && selectedItems.length > 4 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 5 Color</span>
            </label>
            <select
              name="color5"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Color"
              defaultValue={!color5 ? undefined : color5}
            >
              <option value="">Select a Color</option>
              {colors?.map((color: string, i: number) => {
                return (
                  <option key={color + i} value={color}>
                    {color}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {selectedBlockOptions?.colorSecondary5 && selectedItems.length > 4 && (
          <div className="form-control w-[50%] max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">
                Item 5 Secondary Color
              </span>
            </label>
            <select
              name="colorSecondary5"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Color"
              defaultValue={!colorSecondary5 ? undefined : colorSecondary5}
            >
              <option value="">Select a Color</option>
              {colors?.map((color: string, i: number) => {
                return (
                  <option key={color + i} value={color}>
                    {color}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {selectedBlockOptions?.color6 && selectedItems.length > 5 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 6 Color</span>
            </label>
            <select
              name="color6"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Color"
              defaultValue={!color6 ? undefined : color6}
            >
              <option value="">Select a Color</option>
              {colors?.map((color: string, i: number) => {
                return (
                  <option key={color + i} value={color}>
                    {color}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {selectedBlockOptions?.colorSecondary6 && selectedItems.length > 5 && (
          <div className="form-control w-[50%] max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">
                Item 6 Secondary Color
              </span>
            </label>
            <select
              name="colorSecondary6"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Color"
              defaultValue={!colorSecondary6 ? undefined : colorSecondary6}
            >
              <option value="">Select a Color</option>
              {colors?.map((color: string, i: number) => {
                return (
                  <option key={color + i} value={color}>
                    {color}
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>
    </details>
  );
};

export default ItemColorOptions;
