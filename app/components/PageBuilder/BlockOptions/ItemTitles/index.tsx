type Props = {
  defaultValues: BlockOptions;
  selectedBlockOptions: BlockMasterOptions | undefined;
  selectedItems: ContentSelection[];
};

const ItemTitleOptions = ({
  defaultValues,
  selectedBlockOptions,
  selectedItems,
}: Props) => {
  const { titleOne, titleTwo, titleThree, titleFour, titleFive, titleSix } =
    defaultValues || {};

  return (
    <details className="collapse !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">
        Item Titles
      </summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        {selectedBlockOptions?.filterOne && selectedItems.length > 0 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 1 Title</span>
            </label>
            <input
              name="titleOne"
              type="text"
              className="input input-bordered w-[95vw] !text-brand-black/75 sm:w-[215px]"
              placeholder="Title"
              defaultValue={!titleOne ? undefined : titleOne}
            />
          </div>
        )}

        {selectedBlockOptions?.filterTwo && selectedItems.length > 1 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 2 Title</span>
            </label>
            <input
              name="titleTwo"
              type="text"
              className="input input-bordered w-[95vw] !text-brand-black/75 sm:w-[215px]"
              placeholder="Title"
              defaultValue={!titleTwo ? undefined : titleTwo}
            />
          </div>
        )}

        {selectedBlockOptions?.filterThree && selectedItems.length > 2 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 3 Title</span>
            </label>
            <input
              name="titleThree"
              type="text"
              className="input input-bordered w-[95vw] !text-brand-black/75 sm:w-[215px]"
              placeholder="Title"
              defaultValue={!titleThree ? undefined : titleThree}
            />
          </div>
        )}

        {selectedBlockOptions?.filterFour && selectedItems.length > 3 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 4 Title</span>
            </label>
            <input
              name="titleFour"
              type="text"
              className="input input-bordered w-[95vw] !text-brand-black/75 sm:w-[215px]"
              placeholder="Title"
              defaultValue={!titleFour ? undefined : titleFour}
            />
          </div>
        )}

        {selectedBlockOptions?.filterFive && selectedItems.length > 4 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 5 Title</span>
            </label>
            <input
              name="titleFive"
              type="text"
              className="input input-bordered w-[95vw] !text-brand-black/75 sm:w-[215px]"
              placeholder="Title"
              defaultValue={!titleFive ? undefined : titleFive}
            />
          </div>
        )}

        {selectedBlockOptions?.filterSix && selectedItems.length > 5 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Item 6 Title</span>
            </label>
            <input
              name="titleSix"
              type="text"
              className="input input-bordered w-[95vw] !text-brand-black/75 sm:w-[215px]"
              placeholder="Title"
              defaultValue={!titleSix ? undefined : titleSix}
            />
          </div>
        )}
      </div>
    </details>
  );
};

export default ItemTitleOptions;
