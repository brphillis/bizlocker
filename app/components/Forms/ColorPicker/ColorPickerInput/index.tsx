import ToolTip from "~/components/Indicators/ToolTip";
import { capitalizeFirst } from "~/helpers/stringHelpers";
import { returnOtherColorPrefix } from "~/utility/colors";

type Props = {
  label: string;
  inputBackgroundColor?: string;
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
      className={`form-control relative w-[215px] max-md:w-full max-md:items-center max-md:px-3 ${
        customWidth ? customWidth : "w-[215px]"
      }`}
    >
      {tooltip && <ToolTip tip={tooltip} />}
      <label className="label self-start">
        <span className="label-text text-brand-white">
          {capitalizeFirst(label)}
        </span>
      </label>

      <div
        className={`h-[42px] w-full cursor-pointer border-[1px] border-brand-white/25 ${
          inputBackgroundColor
            ? returnOtherColorPrefix(inputBackgroundColor, "bg-")
            : "bg-transparent"
        }`}
        onClick={() => {
          inputOnClick();
        }}
      ></div>
    </div>
  );
};

export default ColorPickerInput;
