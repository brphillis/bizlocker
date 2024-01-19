import ToolTip from "~/components/Indicators/ToolTip";
import { capitalizeFirst } from "~/helpers/stringHelpers";

type Props = {
  valueName: string;
  formName: string;
  defaultValue?: string | number | null;
  blockMasterOption?: boolean;
  tooltip?: string;
  type?: "string" | "number";
  max?: string;
};

const BlockInput = ({
  valueName,
  formName,
  defaultValue,
  blockMasterOption,
  tooltip,
  type = "string",
  max,
}: Props) => {
  return (
    <>
      {blockMasterOption && (
        <div className="flex max-w-full flex-wrap justify-start !gap-3 max-md:justify-center max-md:px-0 w-[215px] max-md:w-full">
          <div className="form-control relative max-sm:items-center w-full">
            {tooltip && (
              <ToolTip tip={tooltip} iconColor="text-brand-white/75" />
            )}
            <label className="label self-start">
              <span className="label-text text-brand-white">
                {capitalizeFirst(valueName)}
              </span>
            </label>
            <input
              type={type}
              step={type === "number" ? "any" : undefined}
              max={max ? max : undefined}
              className="input input-bordered w-full text-brand-black"
              placeholder="None"
              name={formName}
              defaultValue={defaultValue || undefined}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default BlockInput;
