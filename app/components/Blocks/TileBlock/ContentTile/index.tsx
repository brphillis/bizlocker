import { BlockOptions } from "@prisma/client";
import { useNavigate } from "@remix-run/react";
import PatternBackground from "~/components/Layout/Backgrounds/PatternBackground";
import { getThemeColorValueByName } from "~/utility/colors";

type Props = {
  blockOptions: BlockOptions;
  imageSrc: string;
  index: number;
  imageLink: string;
  imageName: string;
};

const ContentTile = ({
  blockOptions,
  imageSrc,
  index,
  imageLink,
  imageName,
}: Props) => {
  const navigate = useNavigate();

  const {
    itemAlign,
    itemAlignMobile,
    itemBackgroundColorsPrimary,
    itemBackgroundColorsSecondary,
    itemBorderRadius,
    itemFilters,
    itemGap,
    itemGapMobile,
    itemJustify,
    itemJustifyMobile,
    itemLinks,
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
    itemShortTextSizes,
    itemShortTextSizesMobile,
    itemTitleColors,
    itemTitleFontWeights,
    itemTitleFontWeightsMobile,
    itemTitles,
    itemTitleSizes,
    itemTitleSizesMobile,
  } = blockOptions;

  return (
    <div
      className={`relative h-full w-full ${itemBorderRadius[index]} ${
        itemBorderRadius[index] ? "p-6 max-md:p-3" : "p-0"
      }`}
    >
      <PatternBackground
        backgroundColor={getThemeColorValueByName(
          itemBackgroundColorsPrimary[index],
        )}
      />

      <img
        className={`object-fit h-full w-full ${itemFilters[index]}`}
        onClick={() =>
          itemLinks[index]
            ? navigate(itemLinks[index])
            : imageLink && navigate(imageLink)
        }
        src={imageSrc}
        alt={imageName}
      />

      {/* TEXT CONTAINER */}
      <div
        className={`absolute flex w-full h-full top-0
        ${itemAlign?.[index]} ${itemAlignMobile[index]} ${itemJustify[index]} ${itemJustifyMobile[index]}`}
      >
        <div
          className={`relative flex flex-col items-center h-max w-max ${itemGap[index]} ${itemGapMobile[index]}
           ${itemMarginTop[index]} ${itemMarginRight[index]} ${itemMarginBottom[index]} ${itemMarginLeft[index]} ${itemMarginTopMobile[index]} ${itemMarginRightMobile[index]} ${itemMarginBottomMobile[index]} ${itemMarginLeftMobile[index]} ${itemPaddingTop[index]} ${itemPaddingRight[index]} ${itemPaddingBottom[index]} ${itemPaddingLeft[index]} ${itemPaddingTopMobile[index]} ${itemPaddingRightMobile[index]} ${itemPaddingBottomMobile[index]} ${itemPaddingLeftMobile[index]}
        `}
        >
          <PatternBackground
            backgroundColor={getThemeColorValueByName(
              itemBackgroundColorsSecondary[index],
            )}
          />

          <div
            className={`relative ${itemTitleColors[index]} ${itemTitleSizes[index]} ${itemTitleSizesMobile[index]} ${itemTitleFontWeights[index]} ${itemTitleFontWeightsMobile[index]}
          `}
          >
            {itemTitles[index]}
          </div>

          <div
            className={`relative ${itemShortTextColors[index]} ${itemShortTextSizes[index]} ${itemShortTextSizesMobile[index]} ${itemShortTextFontWeights[index]} ${itemShortTextFontWeightsMobile[index]}
          `}
          >
            {itemShortText[index]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentTile;
