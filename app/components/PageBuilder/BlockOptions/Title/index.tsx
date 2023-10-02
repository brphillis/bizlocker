type Props = {
  selectedBlock: BlockName | undefined;
  defaultValues: BlockOptions;
  colors: string[];
  selectedBlockOptions: BlockMasterOptions | undefined;
};

const TitleOptions = ({
  selectedBlock,
  defaultValues,
  colors,
  selectedBlockOptions,
}: Props) => {
  const { title, titleColor } = defaultValues || {};

  return (
    <details className="collapse !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">
        {selectedBlock === "text" ? "Heading" : "Title"}
      </summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        {selectedBlockOptions?.title && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
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
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">
                {selectedBlock === "text" ? "Heading Color" : "Title Color"}
              </span>
            </label>
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
    </details>
  );
};

export default TitleOptions;
