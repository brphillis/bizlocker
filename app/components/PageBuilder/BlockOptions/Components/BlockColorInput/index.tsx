import { useState } from "react";
import { IoClose } from "react-icons/io5";
import ToolTip from "~/components/Indicators/ToolTip";
import { capitalizeFirst } from "~/helpers/stringHelpers";
import { getThemeColorNames } from "~/utility/colors";

type Props = {
  valueName: string;
  formName: string;
  defaultValue?: string | null;
  blockMasterOption?: boolean;
  tooltip?: string;
  type?: "bg" | "text" | "border";
};

const BlockColorInput = ({
  valueName,
  formName,
  defaultValue,
  blockMasterOption,
  tooltip,
  type,
}: Props) => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    defaultValue || undefined
  );
  const [editing, setEditing] = useState<boolean>(false);

  let colors = getThemeColorNames();

  return (
    <>
      {blockMasterOption && (
        <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
          <div className="form-control relative max-sm:items-center">
            {tooltip && <ToolTip tip={tooltip} />}
            <label className="label self-start">
              <span className="text-brand-white label-text">
                {capitalizeFirst(valueName)}
              </span>
            </label>
            <div
              className={`border-brand-white/25 h-[42px] w-[95vw] cursor-pointer border-[1px] sm:w-[215px] ${
                selectedValue || defaultValue
              }`}
              onClick={() => setEditing(true)}
            ></div>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed left-[50%] top-0 z-50 flex h-screen w-screen translate-x-[-50%] items-center justify-center bg-black/90">
          <div className="bg-brand-black relative flex max-w-[400px] flex-wrap items-center justify-center gap-3 rounded-sm px-3 pb-6 pt-12">
            <button
              type="button"
              className="absolute right-3 top-3 cursor-pointer"
            >
              <IoClose onClick={() => setEditing(false)} />
            </button>

            {colors.map((colorVal, i) => {
              return (
                <div
                  key={"blockColorSelection_" + colorVal + i}
                  className={`border-brand-white h-6 w-6 cursor-pointer border-[1px] ${
                    "bg-" + colorVal
                  }`}
                  onClick={() => {
                    setSelectedValue("bg-" + colorVal);
                    setEditing(false);
                  }}
                ></div>
              );
            })}
          </div>
        </div>
      )}

      <input hidden readOnly name={formName} value={selectedValue} />
    </>
  );
};

export default BlockColorInput;
