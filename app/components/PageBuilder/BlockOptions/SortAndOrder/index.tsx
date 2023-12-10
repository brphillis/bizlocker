import type { BlockOptions } from "@prisma/client";

type Props = {
  selectedBlock?: BlockName;
  defaultValues?: BlockOptions;
  selectedBlockOptions?: BlockMasterOptions;
};

const SortAndOrderOptions = ({
  selectedBlock,
  defaultValues,
  selectedBlockOptions,
}: Props) => {
  const { sortBy, sortOrder } = defaultValues || {};

  return (
    <details className="collapse !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">
        Sort & Order
      </summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        {selectedBlockOptions?.sortBy && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
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
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Sort Order</span>
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
    </details>
  );
};

export default SortAndOrderOptions;
