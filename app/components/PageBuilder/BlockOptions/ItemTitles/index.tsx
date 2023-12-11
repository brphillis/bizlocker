import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";

type Props = {
  defaultValues?: BlockOptions;
  selectedBlockOptions?: BlockMasterOptions;
  selectedItems: ContentSelection[];
};

const ItemTitleOptions = ({
  defaultValues,
  selectedBlockOptions,
  selectedItems,
}: Props) => {
  const { title1, title2, title3, title4, title5, title6 } =
    defaultValues || {};

  return (
    <details className="collapse !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">
        Item Titles
      </summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        {selectedBlockOptions?.filter1 && selectedItems.length > 0 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 1 Title</span>
            </label>
            <input
              name="title1"
              type="text"
              className="input input-bordered w-[95vw] !text-brand-black/75 sm:w-[215px]"
              placeholder="Title"
              defaultValue={!title1 ? undefined : title1}
            />
          </div>
        )}

        {selectedBlockOptions?.filter2 && selectedItems.length > 1 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 2 Title</span>
            </label>
            <input
              name="title2"
              type="text"
              className="input input-bordered w-[95vw] !text-brand-black/75 sm:w-[215px]"
              placeholder="Title"
              defaultValue={!title2 ? undefined : title2}
            />
          </div>
        )}

        {selectedBlockOptions?.filter3 && selectedItems.length > 2 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 3 Title</span>
            </label>
            <input
              name="title3"
              type="text"
              className="input input-bordered w-[95vw] !text-brand-black/75 sm:w-[215px]"
              placeholder="Title"
              defaultValue={!title3 ? undefined : title3}
            />
          </div>
        )}

        {selectedBlockOptions?.filter4 && selectedItems.length > 3 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 4 Title</span>
            </label>
            <input
              name="title4"
              type="text"
              className="input input-bordered w-[95vw] !text-brand-black/75 sm:w-[215px]"
              placeholder="Title"
              defaultValue={!title4 ? undefined : title4}
            />
          </div>
        )}

        {selectedBlockOptions?.filter5 && selectedItems.length > 4 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 5 Title</span>
            </label>
            <input
              name="title5"
              type="text"
              className="input input-bordered w-[95vw] !text-brand-black/75 sm:w-[215px]"
              placeholder="Title"
              defaultValue={!title5 ? undefined : title5}
            />
          </div>
        )}

        {selectedBlockOptions?.filter6 && selectedItems.length > 5 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 6 Title</span>
            </label>
            <input
              name="title6"
              type="text"
              className="input input-bordered w-[95vw] !text-brand-black/75 sm:w-[215px]"
              placeholder="Title"
              defaultValue={!title6 ? undefined : title6}
            />
          </div>
        )}
      </div>
    </details>
  );
};

export default ItemTitleOptions;
