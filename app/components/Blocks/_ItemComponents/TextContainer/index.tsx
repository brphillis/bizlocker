import { BlockOptions } from "@prisma/client";
import PatternBackground from "~/components/Layout/Backgrounds/PatternBackground";
import { getThemeColorValueByName } from "~/utility/colors";

type Props = {
  blockOptions: BlockOptions;
  index: number;
  position?: "relative" | "absolute";
};

const TextContainer = ({
  blockOptions,
  index,
  position = "absolute",
}: Props) => {
  const {
    itemAlign,
    itemAlignMobile,
    itemBackgroundColorsSecondary,
    itemBackgroundWidthsSecondary,
    itemGap,
    itemGapMobile,
    itemJustify,
    itemJustifyMobile,
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

  return (
    <div
      className={`${position} flex w-full h-full top-0
    ${itemAlign?.[index]} ${itemAlignMobile[index]} ${itemJustify[index]} ${itemJustifyMobile[index]}`}
    >
      <div
        className={`relative flex flex-col items-center h-max 
      ${itemGap[index]} ${itemGapMobile[index]} 
      ${
        itemBackgroundWidthsSecondary[index]
          ? itemBackgroundWidthsSecondary[index]
          : "w-max"
      }
       ${itemMarginTop[index]} ${itemMarginRight[index]} ${
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
            itemBackgroundColorsSecondary[index],
          )}
        />

        <div
          className={`relative text-center select-none ${itemTitleColors[index]} ${itemTitleSizes[index]} ${itemTitleSizesMobile[index]} ${itemTitleFontWeights[index]} ${itemTitleFontWeightsMobile[index]} ${itemTitleShadows[index]}
      `}
        >
          {itemTitles[index]}
        </div>

        <div
          className={`relative text-center select-none ${itemShortTextColors[index]} ${itemShortTextSizes[index]} ${itemShortTextSizesMobile[index]} ${itemShortTextFontWeights[index]} ${itemShortTextFontWeightsMobile[index]} ${itemShortTextShadows[index]}
      `}
        >
          {itemShortText[index]}
        </div>
      </div>
    </div>
  );
};

export default TextContainer;
