import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";

type Props = {
  selectedBlockOptions: BlockMasterOptions | undefined;
  defaultValues?: BlockOptions;
};

const StyleOptions = ({ defaultValues, selectedBlockOptions }: Props) => {
  const { style } = defaultValues || {};

  return (
    <details className="collapse collapse-plus !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">Style</summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        {selectedBlockOptions?.style && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Style</span>
            </label>
            <select
              name="style"
              className=" select w-[95vw] max-w-full text-brand-black/75 sm:w-[215px]"
              defaultValue={!style ? undefined : style}
            >
              <option value={undefined}>Default</option>
            </select>
          </div>
        )}
      </div>
    </details>
  );
};

export default StyleOptions;
