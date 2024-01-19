import ToolTip from "~/components/Indicators/ToolTip";
import { capitalizeFirst } from "~/helpers/stringHelpers";

type Props = {
  valueName: string;
  formName: string;
  defaultValue?: string | number | boolean | null;
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
  const processDefaultValue = (
    defaultValue: boolean | any,
  ): number | undefined => {
    if (typeof defaultValue === "boolean") {
      return defaultValue ? undefined : 0;
    } else {
      return defaultValue !== undefined ? defaultValue : undefined;
    }
  };

  return (
    <>
      {blockMasterOption && (
        <div className="flex max-w-full flex-wrap justify-start !gap-3 max-md:justify-center max-md:px-0 w-[215px] max-md:w-full">
          <div className="form-control relative max-sm:items-center w-full">
            {tooltip && (
              <ToolTip tip={tooltip} iconColor="!text-brand-white/75" />
            )}
            <label className="label self-start">
              <span className="label-text text-brand-white">
                {capitalizeFirst(valueName)}
              </span>
            </label>
            <select
              name={formName}
              className="select text-brand-black/75 w-full"
              defaultValue={processDefaultValue(defaultValue)}
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
