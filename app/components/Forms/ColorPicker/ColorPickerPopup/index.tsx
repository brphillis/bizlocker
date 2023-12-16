import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { capitalizeWords } from "~/helpers/stringHelpers";
import { getThemeColorNames } from "~/utility/colors";

type Props = {
  closeFunction: () => void;
  selectFunction: (selectedColor: string) => void;
  type?: "bg" | "text" | "border" | "outline" | "decoration";
};

const ColorPickerPopup = ({ closeFunction, selectFunction, type }: Props) => {
  const colors = getThemeColorNames();

  const [hoverColor, setHoverColor] = useState<string>();

  return (
    <div className="fixed left-[50%] top-0 z-50 flex h-screen w-screen translate-x-[-50%] items-center justify-center bg-black/90">
      <div className="relative flex max-w-[400px] flex-wrap items-center justify-center gap-3 rounded-sm bg-brand-black px-3 pb-6 pt-12">
        {hoverColor && (
          <div className="absolute left-3 top-3 text-sm text-brand-white">
            {capitalizeWords(hoverColor.replace("-", " "))}
          </div>
        )}

        <button type="button" className="absolute right-3 top-3 cursor-pointer">
          <IoClose onClick={() => closeFunction()} />
        </button>

        {colors.map((colorVal: string, index: number) => {
          return (
            <div
              key={"colorPickerPopupSelection_" + index}
              className={`h-6 w-6 cursor-pointer border-[1px] border-brand-white hover:scale-[1.1] 
              ${"bg-" + colorVal}`}
              onClick={() => selectFunction(colorVal)}
              onMouseEnter={() => setHoverColor(colorVal)}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default ColorPickerPopup;
