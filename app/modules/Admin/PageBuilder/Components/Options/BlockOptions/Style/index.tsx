import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";

type Props = {
  selectedBlockOptions: BlockMasterOptions | undefined;
  defaultValues?: BlockOptions;
};

const StyleOptions = ({ defaultValues, selectedBlockOptions }: Props) => {
  const { style } = defaultValues || {};

  return (
    <details className="collapse collapse-plus !hidden !max-w-[100vw] max-md:!w-[100dvw] !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium text-brand-white">
        Style
      </summary>
      <div className="flex gap-3 flex-wrap items-start justify-start w-full px-3 pb-6 max-md:pb-3">
        {selectedBlockOptions?.style && (
          <div className="form-control max-sm:items-center">
            <div className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Style</span>
            </div>
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
