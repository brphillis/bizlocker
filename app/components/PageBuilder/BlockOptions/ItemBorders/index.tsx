import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";

type Props = {
  defaultValues?: BlockOptions;
  colors: string[];
  selectedBlockOptions?: BlockMasterOptions;
};

const ItemBorderOptions = ({
  defaultValues,
  colors,
  selectedBlockOptions,
}: Props) => {
  const {
    itemBorderSize,
    itemBorderColor,
    itemBorderDisplay,
    itemBorderRadius,
  } = defaultValues || {};

  return (
    <details className="collapse !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">
        Item Borders
      </summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        {selectedBlockOptions?.itemBorderDisplay && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">
                Item Border Display
              </span>
            </label>
            <select
              name="itemBorderDisplay"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              defaultValue={!itemBorderDisplay ? undefined : itemBorderDisplay}
            >
              <option value=" !border-none">No Border</option>
              <option value=" border">Display Border</option>
              <option value=" max-md:!border-none">Hide Mobile</option>
              <option value=" md:!border-none">Hide Desktop</option>
            </select>
          </div>
        )}

        {selectedBlockOptions?.itemBorderSize && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">
                Item Border Size
              </span>
            </label>
            <select
              name="itemBorderSize"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              defaultValue={!itemBorderSize ? undefined : itemBorderSize}
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

        {selectedBlockOptions?.itemBorderColor && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">
                Item Border Color
              </span>
            </label>
            <select
              name="itemBorderColor"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              defaultValue={!itemBorderColor ? undefined : itemBorderColor}
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

        {selectedBlockOptions?.itemBorderRadius && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">
                Item Border Radius
              </span>
            </label>
            <select
              name="itemBorderRadius"
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              defaultValue={!itemBorderRadius ? undefined : itemBorderRadius}
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

export default ItemBorderOptions;
