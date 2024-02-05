import type { BlockOptions } from "@prisma/client";
import ButtonContainer from "./ButtonContainer";
import PatternBackground from "~/components/Layout/Backgrounds/PatternBackground";
import { getThemeColorValueByName } from "~/utility/colors";

type Props = {
  index: number;
  blockOptions: BlockOptions;
};

const ContentContainer = ({ index, blockOptions }: Props) => {
  const {
    numberColumns,
    itemBackgroundColorsPrimary,
    itemBackgroundDisplaysPrimary,
    itemButtonsPrimary,
    itemGap,
    itemGapMobile,
    itemMarginBottom,
    itemMarginBottomMobile,
    itemMarginLeft,
    itemMarginLeftMobile,
    itemMarginRight,
    itemMarginRightMobile,
    itemMarginTop,
    itemMarginTopMobile,
    itemPaddingBottom,
    itemPaddingBottomMobile,
    itemPaddingLeft,
    itemPaddingLeftMobile,
    itemPaddingRight,
    itemPaddingRightMobile,
    itemPaddingTop,
    itemPaddingTopMobile,
    itemShortText,
    itemShortTextColors,
    itemShortTextFontWeights,
    itemShortTextFontWeightsMobile,
    itemShortTextShadows,
    itemShortTextSizes,
    itemShortTextSizesMobile,
    itemTitleColors,
    itemTitleFontWeights,
    itemTitleFontWeightsMobile,
    itemTitles,
    itemTitleShadows,
    itemTitleSizes,
    itemTitleSizesMobile,
  } = blockOptions;

  const hasCardContent =
    itemTitles[index] || itemShortText[index] || itemButtonsPrimary?.[index];

  return (
    <div
      className={`max-w-full ${
        numberColumns && numberColumns > 1
          ? "m-6 max-md:!m-0"
          : "mx-32 my-12 max-md:!m-0"
      }`}
    >
      <div
        className={`relative z-10 h-max w-max max-w-full select-none flex-col items-center overflow-hidden p-6 font-semibold max-md:m-0 gap-3 ${
          hasCardContent ? "flex" : "hidden"
        } ${itemMarginTop[index]} ${itemMarginRight[index]} ${
          itemMarginBottom[index]
        } ${itemMarginLeft[index]} ${itemMarginTopMobile[index]} ${
          itemMarginRightMobile[index]
        } ${itemMarginBottomMobile[index]} ${itemMarginLeftMobile[index]} ${
          itemPaddingTop[index]
        } ${itemPaddingRight[index]} ${itemPaddingBottom[index]} ${
          itemPaddingLeft[index]
        } ${itemPaddingTopMobile[index]} ${itemPaddingRightMobile[index]} ${
          itemPaddingBottomMobile[index]
        } ${itemPaddingLeftMobile[index]}
        `}
      >
        <PatternBackground
          backgroundColor={getThemeColorValueByName(
            itemBackgroundColorsPrimary[index],
          )}
          displayStyle={itemBackgroundDisplaysPrimary[index]}
        />

        <div
          className={`flex flex-col items-center ${
            itemGap[index] ? itemGap[index] : "gap-3"
          } ${itemGapMobile[index]}`}
        >
          {itemTitles[index] && (
            <div
              className={`relative select-none text-center !leading-[55px] max-md:max-w-[90%]
          ${itemTitleColors[index]} ${itemTitleSizes[index]} ${itemTitleSizesMobile[index]} 
          ${itemTitleFontWeights[index]} ${itemTitleFontWeightsMobile[index]} ${itemTitleShadows[index]}`}
            >
              {itemTitles[index]}
            </div>
          )}

          {itemShortText[index] && (
            <div
              className={`relative select-none text-center max-md:max-w-[90%] pb-3
           ${itemShortTextColors[index]} ${itemShortTextSizes[index]} ${itemShortTextSizesMobile[index]}
           ${itemShortTextFontWeights[index]} ${itemShortTextFontWeightsMobile[index]} ${itemShortTextShadows[index]}`}
            >
              {itemShortText[index]}
            </div>
          )}
        </div>

        {!itemShortText[index] && (
          <div className="my-1 hidden max-md:block"></div>
        )}

        <ButtonContainer index={index} blockOptions={blockOptions} />
      </div>
    </div>
  );
};

export default ContentContainer;
