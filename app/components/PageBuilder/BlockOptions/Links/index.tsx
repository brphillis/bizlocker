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
  const { link1, link2, link3, link4, link5, link6 } = defaultValues || {};

  return (
    <details className="collapse !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">Links</summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        {selectedBlockOptions?.link1 &&
          contentType !== "product" &&
          selectedItems.length > 0 && (
            <div className="form-control max-sm:items-center">
              <label className="label max-sm:ml-3 max-sm:!self-start">
                <span className="label-text text-brand-white">Link 1</span>
              </label>
              <input
                name="link1"
                type="string"
                className="input input-bordered w-[95vw] max-w-full text-brand-black sm:w-[215px]"
                placeholder="URL"
                defaultValue={!link1 ? undefined : link1}
              />
            </div>
          )}

        {selectedBlockOptions?.link2 && selectedItems.length > 1 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Link 2</span>
            </label>
            <input
              name="link2"
              type="string"
              className="input input-bordered w-[95vw] max-w-full text-brand-black sm:w-[215px]"
              placeholder="URL"
              defaultValue={!link2 ? undefined : link2}
            />
          </div>
        )}

        {selectedBlockOptions?.link3 && selectedItems.length > 2 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Link 3</span>
            </label>
            <input
              name="link3"
              type="string"
              className="input input-bordered w-[95vw] max-w-full text-brand-black sm:w-[215px]"
              placeholder="URL"
              defaultValue={!link3 ? undefined : link3}
            />
          </div>
        )}

        {selectedBlockOptions?.link4 && selectedItems.length > 3 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Link 4</span>
            </label>
            <input
              name="link4"
              type="string"
              className="input input-bordered w-[95vw] max-w-full text-brand-black  sm:w-[215px]"
              placeholder="URL"
              defaultValue={!link4 ? undefined : link4}
            />
          </div>
        )}

        {selectedBlockOptions?.link5 && selectedItems.length > 4 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Link 5</span>
            </label>
            <input
              name="link5"
              type="string"
              className="input input-bordered w-[95vw] max-w-full text-brand-black  sm:w-[215px]"
              placeholder="URL"
              defaultValue={!link5 ? undefined : link5}
            />
          </div>
        )}

        {selectedBlockOptions?.link6 && selectedItems.length > 5 && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Link 6</span>
            </label>
            <input
              name="link6"
              type="string"
              className="input input-bordered w-[95vw] max-w-full text-brand-black  sm:w-[215px]"
              placeholder="URL"
              defaultValue={!link6 ? undefined : link6}
            />
          </div>
        )}
      </div>
    </details>
  );
};

export default LinkOptions;
