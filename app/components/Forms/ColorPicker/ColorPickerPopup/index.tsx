import { useState } from "react";
import Opacity from "./Opacity";
import ColorPalette from "./ColorPalette";
import { IoClose } from "react-icons/io5";
import { capitalizeWords } from "../../../../helpers/stringHelpers";
import {
  getThemeColorNames,
  removeColorPrefix,
  returnOtherColorPrefix,
} from "../../../../utility/colors";

type Props = {
  closeFunction: () => void;
  selectFunction: (selectedColor: string | undefined) => void;
  type?: "bg" | "text" | "border" | "outline" | "decoration";
  defaultValue?: string;
};

const ColorPickerPopup = ({
  closeFunction,
  selectFunction,
  defaultValue,
  type,
}: Props) => {
  const colors = getThemeColorNames();
  const [hoverColor, setHoverColor] = useState<string | undefined>(
    defaultValue,
  );

  const [currentOpacity, setCurrentOpacity] = useState<number | undefined>(
    defaultValue?.includes("/") ? Number(defaultValue.split("/")[1]) : 100,
  );

  const handleColorSelect = (val?: string) => {
    if (!val) {
      selectFunction(undefined);
      return;
    }

    let formattedValue = val;

    if (type) {
      formattedValue = type + "-" + formattedValue;
    }

    if (currentOpacity && currentOpacity !== 100) {
      formattedValue = formattedValue + "/" + currentOpacity;
    }

    selectFunction(formattedValue);
  };

  return (
    <div className="fixed left-[50%] top-0 z-50 flex h-screen w-screen translate-x-[-50%] items-center justify-center bg-black/90">
      <div className="relative flex max-w-[400px] flex-wrap items-center justify-center gap-3 rounded-sm bg-brand-black px-6 pb-6 pt-12 max-md:w-screen">
        {/* SELECTED COLOR PREVIEW */}
        {hoverColor && (
          <div className="absolute left-6 top-3 flex items-center gap-3 text-brand-white">
            <div
              className={`flex h-3 w-3 cursor-pointer items-center justify-center rounded-full border-[1px] border-brand-white/25 
            ${hoverColor && returnOtherColorPrefix(hoverColor, "bg-")}`}
            ></div>
            <div>
              {capitalizeWords(
                removeColorPrefix(hoverColor)?.replace(/-/g, " "),
              )}
            </div>
          </div>
        )}

        {/* CLOSE BUTTON */}
        <button
          type="button"
          className="absolute right-2 top-2 cursor-pointer text-brand-white/50 hover:text-brand-white"
        >
          <IoClose onClick={() => closeFunction()} />
        </button>

        <div className="flex flex-col gap-1 mt-3">
          <ColorPalette
            label="Brand Colors"
            colors={colors}
            handleColorSelect={handleColorSelect}
            setHoverColor={setHoverColor}
            includeColorWords={["brand", "base", "primary", "secondary"]}
            includeDeselectColor={true}
          />

          <ColorPalette
            label="Other Colors"
            colors={colors}
            handleColorSelect={handleColorSelect}
            setHoverColor={setHoverColor}
            excludeColorWords={["brand", "base", "primary", "secondary"]}
            enableScrolling={true}
          />
        </div>

        {/* OPACITY SELECTION */}
        <Opacity
          currentOpacity={currentOpacity}
          setCurrentOpacity={setCurrentOpacity}
        />
      </div>
    </div>
  );
};

export default ColorPickerPopup;
