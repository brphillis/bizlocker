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
  const handleInputBackgroundString = (bgString: string): string => {
    let formattedString = bgString;

    if (formattedString.includes("-")) {
      let stringArray = formattedString.split("-");

      stringArray[0] = "bg";

      formattedString = stringArray.join("-");

      return formattedString;
    }

    return formattedString;
  };

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
        className={`h-[42px] w-full cursor-pointer border-[1px] border-brand-white/25 ${
          inputBackgroundColor
            ? handleInputBackgroundString(inputBackgroundColor)
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
