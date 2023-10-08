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
    colorOne,
    colorTwo,
    colorThree,
    colorFour,
    colorFive,
    colorSix,
    colorSecondaryOne,
    colorSecondaryTwo,
    colorSecondaryThree,
    colorSecondaryFour,
    colorSecondaryFive,
    colorSecondarySix,
  } = defaultValues || {};

  return (
    <details className="collapse !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">
        Item Colors
      </summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        {selectedBlockOptions?.colorOne && selectedItems.length > 0 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 1 Color</span>
            </label>
            <select
              name="colorOne"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Color"
              defaultValue={!colorOne ? undefined : colorOne}
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

        {selectedBlockOptions?.colorSecondaryOne &&
          selectedItems.length > 0 && (
            <div className="form-control w-[50%] max-sm:items-center">
              <label className="label max-sm:ml-3 max-sm:!self-start">
                <span className="label-text text-brand-white">
                  Item 1 Secondary Color
                </span>
              </label>
              <select
                name="colorSecondaryOne"
                className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
                placeholder="Select a Color"
                defaultValue={
                  !colorSecondaryOne ? undefined : colorSecondaryOne
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

        {selectedBlockOptions?.colorTwo && selectedItems.length > 1 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 2 Color</span>
            </label>
            <select
              name="colorTwo"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Color"
              defaultValue={!colorTwo ? undefined : colorTwo}
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

        {selectedBlockOptions?.colorSecondaryTwo &&
          selectedItems.length > 1 && (
            <div className="form-control w-[50%] max-sm:items-center">
              <label className="label max-sm:ml-3 max-sm:!self-start">
                <span className="label-text text-brand-white">
                  Item 2 Secondary Color
                </span>
              </label>
              <select
                name="colorSecondaryTwo"
                className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
                placeholder="Select a Color"
                defaultValue={
                  !colorSecondaryTwo ? undefined : colorSecondaryTwo
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

        {selectedBlockOptions?.colorThree && selectedItems.length > 2 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 3 Color</span>
            </label>
            <select
              name="colorThree"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Color"
              defaultValue={!colorThree ? undefined : colorThree}
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

        {selectedBlockOptions?.colorSecondaryThree &&
          selectedItems.length > 2 && (
            <div className="form-control w-[50%] max-sm:items-center">
              <label className="label max-sm:ml-3 max-sm:!self-start">
                <span className="label-text text-brand-white">
                  Item 3 Secondary Color
                </span>
              </label>
              <select
                name="colorSecondaryThree"
                className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
                placeholder="Select a Color"
                defaultValue={
                  !colorSecondaryThree ? undefined : colorSecondaryThree
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

        {selectedBlockOptions?.colorFour && selectedItems.length > 3 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 4 Color</span>
            </label>
            <select
              name="colorFour"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Color"
              defaultValue={!colorFour ? undefined : colorFour}
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

        {selectedBlockOptions?.colorSecondaryFour &&
          selectedItems.length > 3 && (
            <div className="form-control w-[50%] max-sm:items-center">
              <label className="label max-sm:ml-3 max-sm:!self-start">
                <span className="label-text text-brand-white">
                  Item 4 Secondary Color
                </span>
              </label>
              <select
                name="colorSecondaryFour"
                className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
                placeholder="Select a Color"
                defaultValue={
                  !colorSecondaryFour ? undefined : colorSecondaryFour
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

        {selectedBlockOptions?.colorFive && selectedItems.length > 4 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 5 Color</span>
            </label>
            <select
              name="colorFive"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Color"
              defaultValue={!colorFive ? undefined : colorFive}
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

        {selectedBlockOptions?.colorSecondaryFive &&
          selectedItems.length > 4 && (
            <div className="form-control w-[50%] max-sm:items-center">
              <label className="label max-sm:ml-3 max-sm:!self-start">
                <span className="label-text text-brand-white">
                  Item 5 Secondary Color
                </span>
              </label>
              <select
                name="colorSecondaryFive"
                className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
                placeholder="Select a Color"
                defaultValue={
                  !colorSecondaryFive ? undefined : colorSecondaryFive
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

        {selectedBlockOptions?.colorSix && selectedItems.length > 5 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 6 Color</span>
            </label>
            <select
              name="colorSix"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Color"
              defaultValue={!colorSix ? undefined : colorSix}
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

        {selectedBlockOptions?.colorSecondarySix &&
          selectedItems.length > 5 && (
            <div className="form-control w-[50%] max-sm:items-center">
              <label className="label max-sm:ml-3 max-sm:!self-start">
                <span className="label-text text-brand-white">
                  Item 6 Secondary Color
                </span>
              </label>
              <select
                name="colorSecondarySix"
                className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
                placeholder="Select a Color"
                defaultValue={
                  !colorSecondarySix ? undefined : colorSecondarySix
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
      </div>
    </details>
  );
};

export default ItemColorOptions;
