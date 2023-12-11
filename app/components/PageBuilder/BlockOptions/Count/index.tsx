import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";

type Props = {
  defaultValues?: BlockOptions;
  selectedBlockOptions?: BlockMasterOptions;
};

const CountOptions = ({ defaultValues, selectedBlockOptions }: Props) => {
  const { count } = defaultValues || {};

  return (
    <details className="collapse !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">Count</summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        {selectedBlockOptions?.count && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Count</span>
            </label>
            <input
              name="count"
              type="number"
              className="input input-bordered w-[95vw] max-w-full text-brand-black  sm:w-[215px]"
              placeholder="Count"
              defaultValue={!count ? undefined : count}
            />
          </div>
        )}
      </div>
    </details>
  );
};

export default CountOptions;
