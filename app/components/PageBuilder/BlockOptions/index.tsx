type Props = {
  selectedBlock: BlockName | undefined;
  defaultValues: BlockOptions;
};

const BlockOptions = ({ selectedBlock, defaultValues }: Props) => {
  const { sortBy, sortOrder, size, count, columns } = defaultValues || {};

  return (
    <>
      {selectedBlock && selectedBlock !== "text" && (
        <div className="w-full px-2 pb-3">
          <p className="mb-3 px-1 pt-3 font-semibold text-brand-white">
            Options
          </p>
          <div className="flex flex-wrap gap-3">
            {selectedBlock === "product" && (
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
                  <option value="name">Name</option>
                  <option value="createdAt">Created</option>
                  <option value="totalSold">Popularity</option>
                  <option value="price">Price</option>
                </select>
              </div>
            )}

            {selectedBlock === "product" && (
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

            {(selectedBlock === "tile" || selectedBlock === "banner") && (
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
                </select>
              </div>
            )}

            {selectedBlock === "product" && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-brand-white">Count</span>
                </label>
                <input
                  name="count"
                  type="number"
                  className="input-bordered input w-[95vw] max-w-full text-brand-black  sm:w-[215px]"
                  placeholder="Count"
                  defaultValue={!count ? undefined : count}
                />
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

            {(selectedBlock === "tile" || selectedBlock === "product") && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-brand-white">Columns</span>
                </label>
                <input
                  name="columns"
                  type="number"
                  className="input-bordered input w-[95vw] max-w-full text-brand-black sm:w-[215px]"
                  placeholder="Columns"
                  defaultValue={!columns ? undefined : columns}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BlockOptions;
