import type { BlockOptions } from "@prisma/client";
import ButtonContainer from "./ButtonContainer";
import PatternBackground from "~/components/Layout/PatternBackground";
import { getThemeColorValueByName } from "~/utility/colors";

type Props = {
  index: number;
  blockOptions: BlockOptions;
};

const ContentContainer = ({ index, blockOptions }: Props) => {
  const {
    itemButtonsPrimary,
    itemShortText,
    itemShortTextColors,
    itemShortTextSizes,
    itemShortTextSizesMobile,
    itemTitleColors,
    itemTitles,
    itemTitleSizes,
    itemTitleFontWeights,
    itemTitleFontWeightsMobile,
    itemTitleSizesMobile,
    itemBackgroundColorsSecondary,
    itemBackgroundDisplaysSecondary,
  } = blockOptions;

  const hasCardContent =
    itemTitles[index] || itemShortText[index] || itemButtonsPrimary?.[index];

  return (
    <div
      className={`relative z-10 m-12 h-max w-max max-w-full select-none flex-col items-center gap-6 overflow-hidden p-6 font-semibold 
        max-md:m-0 max-md:gap-3 
        ${hasCardContent ? "flex" : "hidden"}`}
    >
      <PatternBackground
        backgroundColor={getThemeColorValueByName(
          itemBackgroundColorsSecondary[index]
        )}
        displayStyle={itemBackgroundDisplaysSecondary[index]}
      />

      {itemTitles[index] && (
        <div
          className={`relative select-none text-center !leading-[55px] max-md:max-w-[90%]
          ${itemTitleColors[index]} ${itemTitleSizes[index]} ${itemTitleSizesMobile[index]} 
          ${itemTitleFontWeights[index]} ${itemTitleFontWeightsMobile[index]}`}
        >
          {itemTitles[index]}
        </div>
      )}

      {itemShortText[index] && (
        <div
          className={`relative select-none text-center max-md:max-w-[90%] max-md:pb-3
           ${itemShortTextColors[index]} ${itemShortTextSizes[index]} ${itemShortTextSizesMobile[index]}`}
        >
          {itemShortText[index]}
        </div>
      )}

      {!itemShortText[index] && (
        <div className="my-1 hidden max-md:block"></div>
      )}

      <ButtonContainer index={index} blockOptions={blockOptions} />
    </div>
  );
};

export default ContentContainer;
