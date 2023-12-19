import ToolTip from "~/components/Indicators/ToolTip";
import { capitalizeFirst } from "~/helpers/stringHelpers";

type Props = {
  valueName: string;
  formName: string;
  defaultValue?: string | null;
  blockMasterOption?: boolean;
  selections: Array<SelectValue> | null;
  tooltip?: string;
};

const BlockSelectInput = ({
  valueName,
  formName,
  defaultValue,
  blockMasterOption,
  selections,
  tooltip,
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
            <select
              name={formName}
              className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
              defaultValue={defaultValue || undefined}
            >
              <option value="">Default</option>
              {selections?.map(({ id, name }: SelectValue, index: number) => (
                <option
                  key={`blockOptionSelect_${name}_${id}_${index}`}
                  value={id}
                >
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </>
  );
};

export default BlockSelectInput;
