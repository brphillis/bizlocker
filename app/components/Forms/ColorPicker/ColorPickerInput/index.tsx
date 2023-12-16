import ToolTip from "~/components/Indicators/ToolTip";
import { capitalizeFirst } from "~/helpers/stringHelpers";

type Props = {
  label: string;
  inputBackgroundColor?: string | null;
  inputOnClick: () => void;
  tooltip?: string;
  customWidth?: string;
};

const ColorPickerInput = ({
  label,
  inputBackgroundColor,
  inputOnClick,
  tooltip,
  customWidth,
}: Props) => {
  return (
    <div
      className={`form-control relative w-[215px] max-md:w-full max-md:items-center ${
        customWidth ? customWidth : "w-[215px]"
      }`}
    >
      {tooltip && <ToolTip tip={tooltip} />}
      <label className="label self-start max-md:ml-3">
        <span className="label-text text-brand-white">
          {capitalizeFirst(label)}
        </span>
      </label>

      <div
        className={`h-[42px] w-full cursor-pointer border-[1px] border-brand-white/25 
       ${
         inputBackgroundColor?.startsWith("bg-")
           ? inputBackgroundColor
           : "bg-" + inputBackgroundColor
       }`}
        onClick={() => {
          inputOnClick();
        }}
      ></div>
    </div>
  );
};

export default ColorPickerInput;
