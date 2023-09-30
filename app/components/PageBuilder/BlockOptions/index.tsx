import { blockMaster } from "~/utility/blockMaster";

type Props = {
  selectedBlock: BlockName | undefined;
  defaultValues: BlockOptions;
  contentType: BlockContentType | undefined;
  colors: string[];
};

const BlockOptions = ({
  selectedBlock,
  defaultValues,
  contentType,
  colors,
}: Props) => {
  const {
    backgroundColor,
    borderColor,
    borderDisplay,
    borderRadius,
    borderSize,
    columns,
    count,
    flipX,
    margin,
    linkOne,
    linkTwo,
    linkThree,
    linkFour,
    linkFive,
    linkSix,
    rows,
    shortText,
    shortTextColor,
    size,
    sortBy,
    sortOrder,
    style,
    title,
    titleColor,
  } = defaultValues || {};

  const selectedBlockOptions = blockMaster.find(
    (e) => e.name === selectedBlock
  )?.options;

  return (
    <>
      {selectedBlock && selectedBlock !== "text" && (
        <div className="w-full pb-3">
          <p className="mb-3 px-1 pt-3 font-semibold text-brand-white">
            Options
          </p>
          <div className="flex flex-wrap gap-6">
            {/* STYLE */}
            {/* STYLE */}
            {/* STYLE */}

            <div className="flex w-full flex-wrap justify-start gap-3 empty:hidden">
              {selectedBlockOptions?.style && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-brand-white">Style</span>
                  </label>
                  <select
                    name="style"
                    className=" select w-[95vw] max-w-full text-brand-black/75 sm:w-[215px]"
                    placeholder="Select a Type"
                    defaultValue={!style ? undefined : style}
                  >
                    <option value={undefined}>Default</option>
                  </select>
                </div>
              )}
            </div>

            {/* TITLE */}
            {/* TITLE */}
            {/* TITLE */}

            <div className="flex w-full flex-wrap justify-start gap-3 empty:hidden">
              {selectedBlockOptions?.title && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-brand-white">Title</span>
                  </label>
                  <input
                    name="title"
                    type="text"
                    className="input input-bordered w-[95vw] !text-brand-black/75 sm:w-[215px]"
                    placeholder="Title"
                    defaultValue={!title ? undefined : title}
                  />
                </div>
              )}

              {selectedBlockOptions?.titleColor && (
                <div className="form-control">
                  <label className="label text-sm">Title Color</label>
                  <select
                    name="titleColor"
                    className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
                    placeholder="Select a Color"
                    defaultValue={!titleColor ? undefined : titleColor}
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

            {/* SHORT TEXT */}
            {/* SHORT TEXT */}
            {/* SHORT TEXT */}

            <div className="flex w-full flex-wrap justify-start gap-3 empty:hidden">
              {selectedBlockOptions?.shortText && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-brand-white">
                      Short Text
                    </span>
                  </label>
                  <textarea
                    name="shortText"
                    className="textarea textarea-bordered w-[95vw] !rounded-sm !text-brand-black/75 sm:w-[442px]"
                    placeholder="Short Text"
                    defaultValue={!shortText ? undefined : shortText}
                  />
                </div>
              )}
            </div>

            <div className="flex w-full justify-start gap-3 empty:hidden">
              {selectedBlockOptions?.shortTextColor && (
                <div className="form-control">
                  <label className="label text-sm">Short Text Color</label>
                  <select
                    name="shortTextColor"
                    className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
                    placeholder="Select a Color"
                    defaultValue={!shortTextColor ? undefined : shortTextColor}
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

            {/* BACKGROUND */}
            {/* BACKGROUND */}
            {/* BACKGROUND */}
            <div className="flex w-full flex-wrap justify-start gap-3 empty:hidden">
              {selectedBlockOptions?.backgroundColor && (
                <div className="form-control">
                  <label className="label text-sm">Background Color</label>
                  <select
                    name="backgroundColor"
                    className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
                    placeholder="Select a Color"
                    defaultValue={
                      !backgroundColor ? undefined : backgroundColor
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

            {/* BORDER */}
            {/* BORDER */}
            {/* BORDER */}

            <div className="flex w-full flex-wrap justify-start gap-3 empty:hidden">
              {selectedBlockOptions?.borderDisplay && (
                <div className="form-control">
                  <label className="label text-sm">Border Display</label>
                  <select
                    name="borderDisplay"
                    className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
                    placeholder="Select a Color"
                    defaultValue={!borderDisplay ? undefined : borderDisplay}
                  >
                    <option value=" !border-none">No Border</option>
                    <option value=" border">Display Border</option>
                    <option value=" max-md:!border-none">Hide Mobile</option>
                    <option value=" md:!border-none">Hide Desktop</option>
                  </select>
                </div>
              )}

              {selectedBlockOptions?.borderSize && (
                <div className="form-control">
                  <label className="label text-sm">Border Size</label>
                  <select
                    name="borderSize"
                    className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
                    placeholder="Select a Size"
                    defaultValue={!borderSize ? undefined : borderSize}
                  >
                    <option value="">Select a Size</option>
                    <option value="1px">1px</option>
                    <option value="2px">2px</option>
                    <option value="3px">3px</option>
                    <option value="4px">4px</option>
                    <option value="5px">5px</option>
                    <option value="6px">6px</option>
                    <option value="7px">7px</option>
                    <option value="8px">8px</option>
                    <option value="9px">9px</option>
                    <option value="10px">10px</option>
                    <option value="12px">12px</option>
                    <option value="14px">14px</option>
                    <option value="16px">16px</option>
                    <option value="18px">18px</option>
                    <option value="20px">20px</option>
                    <option value="22px">22px</option>
                    <option value="24px">24px</option>
                  </select>
                </div>
              )}

              {selectedBlockOptions?.borderColor && (
                <div className="form-control">
                  <label className="label text-sm">Border Color</label>
                  <select
                    name="borderColor"
                    className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
                    placeholder="Select a Color"
                    defaultValue={!borderColor ? undefined : borderColor}
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

              {selectedBlockOptions?.borderRadius && (
                <div className="form-control">
                  <label className="label text-sm">Border Radius</label>
                  <select
                    name="borderRadius"
                    className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
                    placeholder="Select a Color"
                    defaultValue={!borderRadius ? undefined : borderRadius}
                  >
                    <option value="">Select Radius</option>
                    <option value="1px">1px</option>
                    <option value="2px">2px</option>
                    <option value="3px">3px</option>
                    <option value="4px">4px</option>
                    <option value="5px">5px</option>
                    <option value="6px">6px</option>
                    <option value="7px">7px</option>
                    <option value="8px">8px</option>
                    <option value="9px">9px</option>
                    <option value="10px">10px</option>
                    <option value="12px">12px</option>
                    <option value="14px">14px</option>
                    <option value="16px">16px</option>
                    <option value="18px">18px</option>
                    <option value="20px">20px</option>
                    <option value="25%">25%</option>
                    <option value="50%">50%</option>
                    <option value="75%">75%</option>
                    <option value="100%">100%</option>
                  </select>
                </div>
              )}
            </div>

            {/* // SORT AND ORDER */}
            {/* // SORT AND ORDER */}
            {/* // SORT AND ORDER */}

            <div className="flex w-full flex-wrap justify-start gap-3 empty:hidden">
              {selectedBlockOptions?.sortBy && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-brand-white">Sort By</span>
                  </label>
                  <select
                    name="sortBy"
                    className=" select w-[95vw] max-w-full text-brand-black/75 sm:w-[215px]"
                    placeholder="Select a Type"
                    defaultValue={!sortBy ? undefined : sortBy}
                  >
                    <option value={undefined}>Select Order</option>
                    {selectedBlock === "product" && (
                      <>
                        <option value="name">Name</option>
                      </>
                    )}

                    {selectedBlock === "article" && (
                      <>
                        <option value="title">Title</option>
                      </>
                    )}

                    <option value="createdAt">Created</option>

                    {selectedBlock === "product" && (
                      <>
                        <option value="totalSold">Popularity</option>
                        <option value="price">Price</option>
                      </>
                    )}
                  </select>
                </div>
              )}

              {selectedBlockOptions?.sortOrder && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-brand-white">
                      Sort Order
                    </span>
                  </label>
                  <select
                    name="sortOrder"
                    className=" select w-[95vw] max-w-full text-brand-black/75 sm:w-[215px]"
                    placeholder="Select a Type"
                    defaultValue={!sortOrder ? undefined : sortOrder}
                  >
                    <option value={undefined}>Select Order</option>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              )}
            </div>

            {/* SIZE */}
            {/* SIZE */}
            {/* SIZE */}

            <div className="flex w-full flex-wrap justify-start gap-3 empty:hidden">
              {selectedBlockOptions?.size && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-brand-white">Size</span>
                  </label>
                  <select
                    name="size"
                    className=" select w-[95vw] max-w-full text-brand-black/75 sm:w-[215px]"
                    placeholder="Select a Type"
                    defaultValue={!size ? undefined : size}
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    {selectedBlock === "banner" && (
                      <option value="native">Native</option>
                    )}
                  </select>
                </div>
              )}
            </div>

            {/* ROTATION */}
            {/* ROTATION */}
            {/* ROTATION */}

            <div className="flex w-full flex-wrap justify-start gap-3 empty:hidden">
              {selectedBlockOptions?.flipX && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-brand-white">Flip X</span>
                  </label>
                  <select
                    name="flipX"
                    className=" select w-[95vw] max-w-full text-brand-black/75 sm:w-[215px]"
                    placeholder="Select a Type"
                    defaultValue={!flipX ? undefined : flipX}
                  >
                    <option value="false">No</option>
                    <option value="-scale-x-100">Yes</option>
                  </select>
                </div>
              )}
            </div>

            {/* COUNT */}
            {/* COUNT */}
            {/* COUNT */}

            <div className="flex w-full flex-wrap justify-start gap-3 empty:hidden">
              {selectedBlockOptions?.count && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-brand-white">Count</span>
                  </label>
                  <input
                    name="count"
                    type="number"
                    className="input input-bordered w-[95vw] max-w-full text-brand-black  sm:w-[215px]"
                    placeholder="Count"
                    defaultValue={!count ? undefined : count}
                  />
                </div>
              )}
            </div>

            {/* MARGIN AND PADDING */}
            {/* MARGIN AND PADDING */}
            {/* MARGIN AND PADDING */}

            <div className="flex w-full flex-wrap justify-start gap-3 empty:hidden">
              {selectedBlockOptions?.margin && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-brand-white">Margin</span>
                  </label>
                  <select
                    name="margin"
                    className=" select w-[95vw] max-w-full text-brand-black/75 sm:w-[215px]"
                    placeholder="Customize Margin"
                    defaultValue={!margin ? undefined : margin}
                  >
                    <option value={undefined}>Normal Margin</option>
                    <option value=" max-md:!-mt-3 !-mt-6">No Top</option>
                    <option value=" max-md:-mt-3">No Top Mobile</option>
                    <option value=" md:!-mt-6">No Top Desktop</option>

                    <option value=" max-md:!-mb-3 !-mb-6">No Bottom</option>
                    <option value=" max-md:-mb-3">No Bottom Mobile</option>
                    <option value=" md:!-mb-6">No Bottom Desktop</option>

                    <option value=" max-md:!-my-3 !-my-6">No Y</option>
                    <option value=" max-md:-my-3">No Y Mobile</option>
                    <option value=" md:!-my-6">No Y Desktop</option>

                    <option value=" max-md:!-mx-3 !-mx-6">No X</option>
                    <option value=" max-md:-mx-3">No X Mobile</option>
                    <option value=" md:!-mx-6">No X Desktop</option>
                  </select>
                </div>
              )}
            </div>

            {/* COLUMNS AND ROWS */}
            {/* COLUMNS AND ROWS */}
            {/* COLUMNS AND ROWS */}

            <div className="flex w-full flex-wrap justify-start gap-3 empty:hidden">
              {selectedBlockOptions?.columns && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-brand-white">Columns</span>
                  </label>
                  <input
                    name="columns"
                    type="number"
                    className="input input-bordered w-[95vw] max-w-full text-brand-black sm:w-[215px]"
                    placeholder="Columns"
                    defaultValue={columns || undefined}
                  />
                </div>
              )}

              {selectedBlockOptions?.rows && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-brand-white">Rows</span>
                  </label>
                  <input
                    name="rows"
                    type="number"
                    className="input input-bordered w-[95vw] max-w-full text-brand-black sm:w-[215px]"
                    placeholder="Rows"
                    defaultValue={rows || undefined}
                  />
                </div>
              )}
            </div>

            <div className="flex w-full flex-wrap justify-start gap-3 empty:hidden">
              {selectedBlockOptions?.linkOne && contentType !== "product" && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-brand-white">Url 1</span>
                  </label>
                  <input
                    name="linkOne"
                    type="string"
                    className="input input-bordered w-[95vw] max-w-full text-brand-black  sm:w-[215px]"
                    placeholder="URL"
                    defaultValue={!linkOne ? undefined : linkOne}
                  />
                </div>
              )}

              {selectedBlockOptions?.linkTwo && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-brand-white">Url 2</span>
                  </label>
                  <input
                    name="linkTwo"
                    type="string"
                    className="input input-bordered w-[95vw] max-w-full text-brand-black  sm:w-[215px]"
                    placeholder="URL"
                    defaultValue={!linkTwo ? undefined : linkTwo}
                  />
                </div>
              )}

              {selectedBlockOptions?.linkThree && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-brand-white">Url 3</span>
                  </label>
                  <input
                    name="linkThree"
                    type="string"
                    className="input input-bordered w-[95vw] max-w-full text-brand-black  sm:w-[215px]"
                    placeholder="URL"
                    defaultValue={!linkThree ? undefined : linkThree}
                  />
                </div>
              )}

              {selectedBlockOptions?.linkFour && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-brand-white">Url 4</span>
                  </label>
                  <input
                    name="linkFour"
                    type="string"
                    className="input input-bordered w-[95vw] max-w-full text-brand-black  sm:w-[215px]"
                    placeholder="URL"
                    defaultValue={!linkFour ? undefined : linkFour}
                  />
                </div>
              )}

              {selectedBlockOptions?.linkFive && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-brand-white">Url 5</span>
                  </label>
                  <input
                    name="linkFive"
                    type="string"
                    className="input input-bordered w-[95vw] max-w-full text-brand-black  sm:w-[215px]"
                    placeholder="URL"
                    defaultValue={!linkFive ? undefined : linkFive}
                  />
                </div>
              )}

              {selectedBlockOptions?.linkSix && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-brand-white">Url 6</span>
                  </label>
                  <input
                    name="linkSix"
                    type="string"
                    className="input input-bordered w-[95vw] max-w-full text-brand-black  sm:w-[215px]"
                    placeholder="URL"
                    defaultValue={!linkSix ? undefined : linkSix}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlockOptions;
