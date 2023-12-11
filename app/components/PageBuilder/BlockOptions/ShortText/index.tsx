import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";
import type { BlockName } from "~/utility/blockMaster/types";

type Props = {
  colors: string[];
  selectedBlock?: BlockName;
  defaultValues?: BlockOptions;
  selectedBlockOptions?: BlockMasterOptions;
};

const ShortTextOptions = ({
  selectedBlock,
  defaultValues,
  colors,
  selectedBlockOptions,
}: Props) => {
  const { shortText, shortTextColor } = defaultValues || {};

  return (
    <details className="collapse !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">
        {selectedBlock === "text" ? "Text" : "Short Text"}
      </summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        {selectedBlockOptions?.shortTextColor && (
          <div className="form-control w-full max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">
                {selectedBlock === "text" ? "Text Color" : "Short Text Color"}
              </span>
            </label>
            <select
              name="shortTextColor"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              placeholder="Select a Color"
              defaultValue={!shortTextColor ? undefined : shortTextColor}
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

        {selectedBlockOptions?.shortText && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Short Text</span>
            </label>
            <textarea
              name="shortText"
              className="textarea textarea-bordered w-[95vw] !rounded-sm !text-brand-black/75 sm:w-[442px]"
              placeholder="Short Text"
              defaultValue={!shortText ? undefined : shortText}
            />
          </div>
        )}
      </div>
    </details>
  );
};

export default ShortTextOptions;
