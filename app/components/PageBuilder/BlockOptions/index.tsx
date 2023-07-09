type Props = {
  selectedBlock: BlockName | undefined;
};

const BlockOptions = ({ selectedBlock }: Props) => {
  return (
    <>
      {selectedBlock && (
        <div className="w-full bg-base-300 px-2 py-3">
          <p className="px-1 pb-3 font-bold">Options</p>
          <div className="flex flex-wrap gap-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Sort By</span>
              </label>
              <select
                name="sortBy"
                className="select-bordered select w-[95vw] max-w-full sm:w-[215px]"
                placeholder="Select a Type"
              >
                <option value="">Select Order</option>
                <option value="name">Name</option>
                <option value="createdAt">Created</option>
                <option value="totalSold">Popularity</option>
                <option value="price">Price</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Sort Order</span>
              </label>
              <select
                name="sortOrder"
                className="select-bordered select w-[95vw] max-w-full sm:w-[215px]"
                placeholder="Select a Type"
              >
                <option value="">Select Order</option>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Size</span>
              </label>
              <select
                name="size"
                className="select-bordered select w-[95vw] max-w-full sm:w-[215px]"
                placeholder="Select a Type"
              >
                <option value="">Select Size</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Count</span>
              </label>
              <input
                name="count"
                type="number"
                className="input-bordered input w-[95vw] max-w-full sm:w-[215px]"
                placeholder="Count"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Rows</span>
              </label>
              <input
                name="rows"
                type="number"
                className="input-bordered input w-[95vw] max-w-full sm:w-[215px]"
                placeholder="Rows"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Columns</span>
              </label>
              <input
                name="columns"
                type="number"
                className="input-bordered input w-[95vw] max-w-full sm:w-[215px]"
                placeholder="Columns"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlockOptions;
