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
    margin,
    primaryLink,
    secondaryLink,
    shortText,
    shortTextColor,
    size,
    sortBy,
    sortOrder,
    style,
    title,
    titleColor,
  } = defaultValues || {};

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
            {selectedBlock === "hero" && (
              <div className="flex w-full flex-wrap justify-start gap-3">
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
              </div>
            )}

            {/* TITLE */}
            {/* TITLE */}
            {/* TITLE */}
            {selectedBlock === "hero" && (
              <div className="flex w-full flex-wrap justify-start gap-3">
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
              </div>
            )}

            {/* SHORT TEXT */}
            {/* SHORT TEXT */}
            {/* SHORT TEXT */}
            {selectedBlock === "hero" && (
              <div className="flex w-full flex-wrap justify-start gap-3">
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
              </div>
            )}
            {selectedBlock === "hero" && (
              <div className="flex w-full justify-start gap-3">
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
              </div>
            )}

            {/* BACKGROUND */}
            {/* BACKGROUND */}
            {/* BACKGROUND */}
            {(selectedBlock === "banner" || selectedBlock === "hero") && (
              <div className="flex w-full flex-wrap justify-start gap-3">
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
              </div>
            )}

            {/* BORDER */}
            {/* BORDER */}
            {/* BORDER */}
            {selectedBlock === "hero" && (
              <div className="flex w-full flex-wrap justify-start gap-3">
                <div className="form-control">
                  <label className="label text-sm">Border Display</label>
                  <select
                    name="borderDisplay"
                    className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
                    placeholder="Select a Color"
                    defaultValue={!borderDisplay ? undefined : borderDisplay}
                  >
                    <option value=" !border-none">No Border</option>
                    <option value=" max-md:!border-none">Hide Mobile</option>
                    <option value=" md:!border-none">Hide Desktop</option>
                  </select>
                </div>

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
              </div>
            )}

            {/* // SORT AND ORDER */}
            {/* // SORT AND ORDER */}
            {/* // SORT AND ORDER */}

            {(selectedBlock === "product" || selectedBlock === "article") && (
              <div className="flex w-full flex-wrap justify-start gap-3">
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
              </div>
            )}

            {/* SIZE */}
            {/* SIZE */}
            {/* SIZE */}
            {selectedBlock === "banner" && (
              <div className="flex w-full flex-wrap justify-start gap-3">
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
              </div>
            )}

            {/* COUNT */}
            {/* COUNT */}
            {/* COUNT */}
            {selectedBlock === "product" && (
              <div className="flex w-full flex-wrap justify-start gap-3">
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
              </div>
            )}

            {/* MARGIN AND PADDING */}
            {/* MARGIN AND PADDING */}
            {/* MARGIN AND PADDING */}
            {(selectedBlock === "banner" || selectedBlock === "hero") && (
              <div className="flex w-full flex-wrap justify-start gap-3">
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
              </div>
            )}

            {/*      
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Rows</span>
                </label>
                <input
                  name="rows"
                  type="number"
                  className="input-bordered input w-[95vw] max-w-full text-brand-black sm:w-[215px]"
                  placeholder="Rows"
                  defaultValue={rows as number}
                />
              </div> */}

            {/* COLUMNS */}
            {/* COLUMNS */}
            {/* COLUMNS */}

            {(selectedBlock === "tile" || selectedBlock === "product") && (
              <div className="flex w-full flex-wrap justify-start gap-3">
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
              </div>
            )}

            {selectedBlock === "hero" && (
              <div className="flex w-full flex-wrap justify-start gap-3">
                {contentType !== "product" && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-brand-white">
                        Primary Link
                      </span>
                    </label>
                    <input
                      name="primaryLink"
                      type="string"
                      className="input input-bordered w-[95vw] max-w-full text-brand-black  sm:w-[215px]"
                      placeholder="URL"
                      defaultValue={!primaryLink ? undefined : primaryLink}
                    />
                  </div>
                )}

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-brand-white">
                      Secondary Link
                    </span>
                  </label>
                  <input
                    name="secondaryLink"
                    type="string"
                    className="input input-bordered w-[95vw] max-w-full text-brand-black  sm:w-[215px]"
                    placeholder="URL"
                    defaultValue={!secondaryLink ? undefined : secondaryLink}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BlockOptions;
