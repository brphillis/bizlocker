import { useRef, useState } from "react";
import { IoArrowDownOutline, IoArrowUpOutline, IoClose } from "react-icons/io5";
import { capitalizeWords, includesWords } from "~/helpers/stringHelpers";
import {
  getThemeColorNames,
  removeColorPrefix,
  returnOtherColorPrefix,
} from "~/utility/colors";
import BasicInput from "../../Input/BasicInput";
import SquareIconButton from "~/components/Buttons/SquareIconButton";

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
  const [hoverColor, setHoverColor] = useState<string>();
  const [currentOpacity, setCurrentOpacity] = useState<number | undefined>(
    type !== "bg"
      ? defaultValue?.includes("/")
        ? Number(defaultValue.split("/")[1])
        : 100
      : 100
  );

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

  const handleColorSelect = (val: string) => {
    if (!val) {
      selectFunction(undefined);
      return;
    }

    let formattedValue = val;

    if (type) {
      formattedValue = type + "-" + formattedValue;
    }

    if (currentOpacity) {
      formattedValue = formattedValue + "/" + currentOpacity;
    }

    selectFunction(formattedValue);
  };

  return (
    <div className="fixed left-[50%] top-0 z-50 flex h-screen w-screen translate-x-[-50%] items-center justify-center bg-black/90">
      <div className="relative flex max-w-[400px] flex-wrap items-center justify-center gap-3 rounded-sm bg-brand-black px-6 pb-6 pt-12 max-md:w-screen">
        {/* SELECTED COLOR PREVIEW */}
        {defaultValue && (
          <div className="absolute left-6 top-3 flex items-center gap-3">
            <div
              className={`flex h-3 w-3 cursor-pointer items-center justify-center rounded-full border-[1px] border-brand-white/25 
            ${
              (hoverColor && returnOtherColorPrefix(hoverColor, "bg-")) ||
              returnOtherColorPrefix(defaultValue, "bg-")
            } `}
            ></div>
            <div>
              {capitalizeWords(hoverColor?.replace(/-/g, " ")) ||
                capitalizeWords(
                  removeColorPrefix(defaultValue)
                    .split("/")[0]
                    .replace(/-/g, " ")
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

        <div>
          <div className="select-none">Brand Colors</div>
          <div className="scrollbar-hide flex max-h-[210px] flex-row flex-wrap items-center justify-center gap-3 overflow-scroll py-3">
            {/* UNDEFINED COLOR */}
            <div
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-[1px] border-brand-white/25 bg-transparent text-brand-white hover:scale-[1.1]"
              onClick={() => selectFunction(undefined)}
              onMouseEnter={() => setHoverColor("None")}
            >
              <div className="text-brand-white/50">
                <IoClose />
              </div>
            </div>

            {/* BRAND COLOR LIST */}
            {colors.map((colorVal: string, index: number) => {
              if (
                includesWords(colorVal.toLocaleLowerCase(), [
                  "brand",
                  "base",
                  "primary",
                  "secondary",
                ])
              ) {
                return (
                  <div
                    key={"colorPickerPopupSelection_" + index}
                    className={`h-6 w-6 cursor-pointer rounded-full border-[1px] border-brand-white/25 hover:scale-[1.1] 
                ${"bg-" + colorVal}`}
                    onClick={() => handleColorSelect(colorVal)}
                    onMouseEnter={() => setHoverColor(colorVal)}
                  ></div>
                );
              } else return null;
            })}
          </div>
        </div>

        <div className="relative mt-3">
          <div className="select-none">Other Colors</div>
          <div
            ref={colorSelectionRef}
            className="scrollbar-hide flex max-h-[220px] flex-row flex-wrap items-center justify-center gap-3 overflow-scroll py-3"
          >
            {/* TAILWIND COLOR LIST */}
            {colors.map((colorVal: string, index: number) => {
              if (
                !includesWords(colorVal.toLocaleLowerCase(), [
                  "brand",
                  "base",
                  "primary",
                  "secondary",
                ])
              ) {
                return (
                  <div
                    key={"colorPickerPopupSelection_" + index}
                    className={`h-6 w-6 cursor-pointer rounded-full border-[1px] border-brand-white/25 hover:scale-[1.1] 
                ${"bg-" + colorVal}`}
                    onClick={() => handleColorSelect(colorVal)}
                    onMouseEnter={() => setHoverColor(colorVal)}
                  ></div>
                );
              } else return null;
            })}
          </div>

          <div
            className="absolute -right-4 top-3 cursor-pointer text-brand-white/50 hover:text-brand-white"
            onClick={handleScrollUp}
          >
            <IoArrowUpOutline size={12} />
          </div>

          <div
            className="absolute -bottom-4 -right-4 cursor-pointer text-brand-white/50 hover:text-brand-white"
            onClick={handleScrollDown}
          >
            <IoArrowDownOutline size={12} />
          </div>
        </div>

        {/* OPACITY SELECTION */}
        {type !== "bg" && (
          <div className="flex items-end gap-3 pt-3">
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
        )}
      </div>
    </div>
  );
};

export default ColorPickerPopup;
