type Props = {
  defaultValues: BlockOptions;
  selectedBlockOptions: BlockMasterOptions | undefined;
  selectedItems: ContentSelection[];
  contentType: BlockContentType | undefined;
};

const LinkOptions = ({
  defaultValues,
  selectedBlockOptions,
  selectedItems,
  contentType,
}: Props) => {
  const { linkOne, linkTwo, linkThree, linkFour, linkFive, linkSix } =
    defaultValues || {};

  return (
    <details className="collapse !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">Links</summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        {selectedBlockOptions?.linkOne &&
          contentType !== "product" &&
          selectedItems.length > 0 && (
            <div className="form-control max-sm:items-center">
              <label className="label max-sm:ml-3 max-sm:!self-start">
                <span className="label-text text-brand-white">Link 1</span>
              </label>
              <input
                name="linkOne"
                type="string"
                className="input input-bordered w-[95vw] max-w-full text-brand-black sm:w-[215px]"
                placeholder="URL"
                defaultValue={!linkOne ? undefined : linkOne}
              />
            </div>
          )}

        {selectedBlockOptions?.linkTwo && selectedItems.length > 1 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Link 2</span>
            </label>
            <input
              name="linkTwo"
              type="string"
              className="input input-bordered w-[95vw] max-w-full text-brand-black sm:w-[215px]"
              placeholder="URL"
              defaultValue={!linkTwo ? undefined : linkTwo}
            />
          </div>
        )}

        {selectedBlockOptions?.linkThree && selectedItems.length > 2 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Link 3</span>
            </label>
            <input
              name="linkThree"
              type="string"
              className="input input-bordered w-[95vw] max-w-full text-brand-black sm:w-[215px]"
              placeholder="URL"
              defaultValue={!linkThree ? undefined : linkThree}
            />
          </div>
        )}

        {selectedBlockOptions?.linkFour && selectedItems.length > 3 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Link 4</span>
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

        {selectedBlockOptions?.linkFive && selectedItems.length > 4 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Link 5</span>
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

        {selectedBlockOptions?.linkSix && selectedItems.length > 5 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Link 6</span>
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
    </details>
  );
};

export default LinkOptions;
