import { IoWaterOutline } from "react-icons/io5";
import ToolTip from "~/components/Indicators/ToolTip";
import { capitalizeFirst } from "~/helpers/stringHelpers";
import { returnOtherColorPrefix } from "~/utility/colors";

type Props = {
  label: string;
  inputBackgroundColor?: string;
  inputOnClick: () => void;
  tooltip?: string;
  extendStyle?: string;
};

const ColorPickerInput = ({
  label,
  inputBackgroundColor,
  inputOnClick,
  tooltip,
  extendStyle,
}: Props) => {
  return (
    <div
      className={`group form-control relative max-md:items-center w-[215px] max-md:w-full
      ${extendStyle}`}
    >
      {tooltip && <ToolTip tip={tooltip} />}
      <label className="label self-start">
        <span className="label-text text-brand-white">
          {capitalizeFirst(label)}
        </span>
      </label>

      <button
        type="button"
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
      </button>
    </div>
  );
};

export default ColorPickerInput;
