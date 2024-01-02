import { IoWaterOutline } from "react-icons/io5";
import ToolTip from "~/components/Indicators/ToolTip";
import { capitalizeFirst } from "~/helpers/stringHelpers";
import { returnOtherColorPrefix } from "~/utility/colors";

type Props = {
  label: string;
  inputBackgroundColor?: string;
  inputOnClick: () => void;
  tooltip?: string;
  customWidth?: string;
  extendStyle?: string;
};

const ColorPickerInput = ({
  label,
  inputBackgroundColor,
  inputOnClick,
  tooltip,
  customWidth,
  extendStyle,
}: Props) => {
  return (
    <div
      className={`group form-control relative max-md:w-full max-md:items-center max-md:px-3
      ${extendStyle} ${customWidth ? customWidth : "w-[215px]"}`}
    >
      {tooltip && <ToolTip tip={tooltip} />}
      <label className="label self-start">
        <span className="label-text text-brand-white">
          {capitalizeFirst(label)}
        </span>
      </label>

      <div
        className={`relative h-[42px] w-full cursor-pointer border-[1px] border-brand-white/25 ${
          inputBackgroundColor
            ? returnOtherColorPrefix(inputBackgroundColor, "bg-")
            : "bg-transparent"
        }`}
        onClick={() => {
          inputOnClick();
        }}
      >
        <div className="absolute right-3 top-[50%] translate-y-[-50%] opacity-50 group-hover:scale-[1.15]">
          <IoWaterOutline />
        </div>
      </div>
    </div>
  );
};

export default ColorPickerInput;
