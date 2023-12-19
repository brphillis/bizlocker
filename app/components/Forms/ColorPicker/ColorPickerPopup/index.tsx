import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { capitalizeWords } from "~/helpers/stringHelpers";
import { getThemeColorNames } from "~/utility/colors";
import BasicInput from "../../Input/BasicInput";
import SquareIconButton from "~/components/Buttons/SquareIconButton";

type Props = {
  closeFunction: () => void;
  selectFunction: (selectedColor: string | undefined) => void;
  type?: "bg" | "text" | "border" | "outline" | "decoration";
};

const ColorPickerPopup = ({ closeFunction, selectFunction, type }: Props) => {
  const colors = getThemeColorNames();
  const [hoverColor, setHoverColor] = useState<string>();
  const [currentOpacity, setCurrentOpacity] = useState<number | undefined>(100);

  const handleChangeOpacity = (mode: "add" | "subtract", opacity?: number) => {
    if (!opacity) {
      setCurrentOpacity(10);
      return;
    }

    if (opacity >= 100 && mode === "add") {
      setCurrentOpacity(100);
      return;
    }

    if (opacity <= 10 && mode === "subtract") {
      setCurrentOpacity(10);
      return;
    }

    if (mode === "add") {
      setCurrentOpacity(opacity + 10);
    }

    if (mode === "subtract") {
      setCurrentOpacity(opacity - 10);
    }
  };

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

        <div
          className="flex h-6 w-6 cursor-pointer items-center justify-center border-[1px] border-brand-white bg-transparent text-brand-white hover:scale-[1.1]"
          onClick={() => selectFunction(undefined)}
          onMouseEnter={() => setHoverColor("None")}
        >
          <IoClose />
        </div>

        {colors.map((colorVal: string, index: number) => {
          return (
            <div
              key={"colorPickerPopupSelection_" + index}
              className={`h-6 w-6 cursor-pointer border-[1px] border-brand-white hover:scale-[1.1] 
              ${"bg-" + colorVal}`}
              onClick={() =>
                selectFunction(
                  colorVal ? colorVal + "/" + currentOpacity : undefined
                )
              }
              onMouseEnter={() => setHoverColor(colorVal)}
            ></div>
          );
        })}

        <div className="flex items-end gap-3">
          <SquareIconButton
            iconName="IoRemove"
            size="medium"
            color="primary"
            onClickFunction={() =>
              handleChangeOpacity("subtract", currentOpacity)
            }
          />
          <BasicInput
            name="opacity_placeholder"
            label="Opacity"
            placeholder="Opacity"
            type="number"
            customWidth="w-full"
            labelColor="text-brand-white"
            value={currentOpacity}
            step={5}
            disabled={true}
            styles="disabled:!bg-brand-white"
          />
          <SquareIconButton
            iconName="IoAdd"
            size="medium"
            color="primary"
            onClickFunction={() => handleChangeOpacity("add", currentOpacity)}
          />
        </div>
      </div>
    </div>
  );
};

export default ColorPickerPopup;
