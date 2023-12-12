import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";

type Props = {
  defaultValues?: BlockOptions;
  colors: string[];
  selectedBlockOptions?: BlockMasterOptions;
};

const BorderOptions = ({
  defaultValues,
  colors,
  selectedBlockOptions,
}: Props) => {
  const { borderSize, borderColor, borderDisplay, borderRadius } =
    defaultValues || {};

  return (
    <details className="collapse !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">Border</summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        {selectedBlockOptions?.borderDisplay && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">
                Border Display
              </span>
            </label>
            <select
              name="borderDisplay"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              defaultValue={!borderDisplay ? undefined : borderDisplay}
            >
              <option value=" !border-none">No Border</option>
              <option value=" border">Display Border</option>
              <option value=" max-md:!border-none">Hide Mobile</option>
              <option value=" md:!border-none">Hide Desktop</option>
            </select>
          </div>
        )}

        {selectedBlockOptions?.borderSize && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Border Size</span>
            </label>
            <select
              name="borderSize"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              defaultValue={!borderSize ? undefined : borderSize}
            >
              <option value="">Select a Size</option>
              <option value="1px">1px</option>
              <option value="2px">2px</option>
              <option value="3px">3px</option>
              <option value="4px">4px</option>
              <option value="5px">5px</option>
              <option value="6px">6px</option>
              <option value="7px">7px</option>
              <option value="8px">8px</option>
              <option value="9px">9px</option>
              <option value="10px">10px</option>
              <option value="12px">12px</option>
              <option value="14px">14px</option>
              <option value="16px">16px</option>
              <option value="18px">18px</option>
              <option value="20px">20px</option>
              <option value="22px">22px</option>
              <option value="24px">24px</option>
            </select>
          </div>
        )}

        {selectedBlockOptions?.borderColor && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Border Color</span>
            </label>
            <select
              name="borderColor"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              defaultValue={!borderColor ? undefined : borderColor}
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

        {selectedBlockOptions?.borderRadius && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Border Radius</span>
            </label>
            <select
              name="borderRadius"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              defaultValue={!borderRadius ? undefined : borderRadius}
            >
              <option value="">Select Radius</option>
              <option value="1px">1px</option>
              <option value="2px">2px</option>
              <option value="3px">3px</option>
              <option value="4px">4px</option>
              <option value="5px">5px</option>
              <option value="6px">6px</option>
              <option value="7px">7px</option>
              <option value="8px">8px</option>
              <option value="9px">9px</option>
              <option value="10px">10px</option>
              <option value="12px">12px</option>
              <option value="14px">14px</option>
              <option value="16px">16px</option>
              <option value="18px">18px</option>
              <option value="20px">20px</option>
              <option value="25%">25%</option>
              <option value="50%">50%</option>
              <option value="75%">75%</option>
              <option value="100%">100%</option>
            </select>
          </div>
        )}
      </div>
    </details>
  );
};

export default BorderOptions;
