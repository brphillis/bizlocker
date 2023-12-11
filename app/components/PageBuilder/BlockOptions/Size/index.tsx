import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";
import type { BlockName } from "~/utility/blockMaster/types";

type Props = {
  selectedBlock?: BlockName;
  defaultValues?: BlockOptions;
  selectedBlockOptions?: BlockMasterOptions;
};

const SizeOptions = ({
  selectedBlock,
  defaultValues,
  selectedBlockOptions,
}: Props) => {
  const { size, sizeMobile } = defaultValues || {};

  return (
    <details className="collapse !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">Size</summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        {selectedBlockOptions?.size && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Size</span>
            </label>
            <select
              name="size"
              className=" select w-[95vw] max-w-full text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Type"
              defaultValue={!size ? undefined : size}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              {selectedBlock === "banner" && (
                <option value="native">Native</option>
              )}
            </select>
          </div>
        )}

        {selectedBlockOptions?.sizeMobile && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Size</span>
            </label>
            <select
              name="sizeMobile"
              className=" select w-[95vw] max-w-full text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Type"
              defaultValue={!sizeMobile ? undefined : sizeMobile}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              {selectedBlock === "banner" && (
                <option value="native">Native</option>
              )}
            </select>
          </div>
        )}
      </div>
    </details>
  );
};

export default SizeOptions;
