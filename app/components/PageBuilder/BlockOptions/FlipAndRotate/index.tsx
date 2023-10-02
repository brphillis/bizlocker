type Props = {
  defaultValues: BlockOptions;
  selectedBlockOptions: BlockMasterOptions | undefined;
};

const FlipAndRotateOptions = ({
  defaultValues,
  selectedBlockOptions,
}: Props) => {
  const { flipX } = defaultValues || {};

  return (
    <details className="collapse !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">
        Flip & Rotate
      </summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        {selectedBlockOptions?.flipX && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Flip X</span>
            </label>
            <select
              name="flipX"
              className=" select w-[95vw] max-w-full text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Type"
              defaultValue={!flipX ? undefined : flipX}
            >
              <option value="">No</option>
              <option value="-scale-x-100">Yes</option>
            </select>
          </div>
        )}
      </div>
    </details>
  );
};

export default FlipAndRotateOptions;
