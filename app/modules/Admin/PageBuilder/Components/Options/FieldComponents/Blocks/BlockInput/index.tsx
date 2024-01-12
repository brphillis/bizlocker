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
        <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
          <div className="form-control relative max-sm:items-center">
            {tooltip && <ToolTip tip={tooltip} />}
            <label className="label self-start">
              <span className="label-text text-brand-white">
                {capitalizeFirst(valueName)}
              </span>
            </label>
            <input
              type={type}
              step={type === "number" ? "any" : undefined}
              max={max ? max : undefined}
              className="input input-bordered w-[95vw] max-w-full text-brand-black sm:w-[215px]"
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
