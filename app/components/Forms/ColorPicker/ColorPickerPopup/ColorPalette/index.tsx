import { useRef } from "react";
import { IoArrowDownOutline, IoArrowUpOutline, IoClose } from "react-icons/io5";
import { includesWords } from "../../../../../helpers/stringHelpers";

type Props = {
  colors: string[];
  label: string;
  handleColorSelect: (color?: string) => void;
  setHoverColor: (color: string) => void;
  includeColorWords?: string[];
  excludeColorWords?: string[];
  includeDeselectColor?: boolean;
  enableScrolling?: boolean;
};

const ColorPalette = ({
  colors,
  handleColorSelect,
  setHoverColor,
  label,
  includeColorWords,
  excludeColorWords,
  includeDeselectColor,
  enableScrolling,
}: Props) => {
  const colorSelectionRef = useRef<HTMLDivElement>(null);

  const handleScrollUp = () => {
    if (colorSelectionRef.current) {
      colorSelectionRef.current.scrollTop -= 100;
    }
  };

  const handleScrollDown = () => {
    if (colorSelectionRef.current) {
      colorSelectionRef.current.scrollTop += 100;
    }
  };

  return (
    <div className="relative">
      <div className="select-none text-brand-white/75 text-sm">{label}</div>
      <div
        ref={colorSelectionRef}
        className="scrollbar-hide flex max-h-[220px] flex-row flex-wrap items-center justify-center gap-3 overflow-scroll py-3"
      >
        {includeDeselectColor && (
          <button
            type="button"
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-[1px] border-brand-white/25 bg-transparent text-brand-white hover:scale-[1.1]"
            onClick={() => {
              handleColorSelect(undefined);
            }}
            onMouseEnter={() => {
              setHoverColor("None");
            }}
          >
            <div className="text-brand-white/50">
              <IoClose />
            </div>
          </button>
        )}

        {colors.map((colorVal: string, index: number) => {
          if (
            (includeColorWords &&
              includesWords(colorVal.toLocaleLowerCase(), includeColorWords)) ||
            (excludeColorWords &&
              !includesWords(colorVal.toLocaleLowerCase(), excludeColorWords))
          ) {
            return (
              <button
                key={"colorPickerPopupSelection_" + index}
                type="button"
                className={`h-6 w-6 cursor-pointer rounded-full border-[1px] border-brand-white/25 hover:scale-[1.1] 
                  ${"bg-" + colorVal}`}
                onClick={() => {
                  handleColorSelect(colorVal);
                }}
                onMouseEnter={() => {
                  setHoverColor(colorVal);
                }}
              ></button>
            );
          } else return null;
        })}
      </div>

      {enableScrolling && (
        <>
          <button
            type="button"
            className="absolute -right-4 top-3 cursor-pointer text-brand-white/50 hover:text-brand-white"
            onClick={handleScrollUp}
          >
            <IoArrowUpOutline size={12} />
          </button>

          <button
            type="button"
            className="absolute -bottom-4 -right-4 cursor-pointer text-brand-white/50 hover:text-brand-white"
            onClick={handleScrollDown}
          >
            <IoArrowDownOutline size={12} />
          </button>
        </>
      )}
    </div>
  );
};

export default ColorPalette;
