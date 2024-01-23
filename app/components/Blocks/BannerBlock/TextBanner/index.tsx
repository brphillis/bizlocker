import type { BlockOptions } from "@prisma/client";
import { useNavigate } from "@remix-run/react";
import PatternBackground from "~/components/Layout/Backgrounds/PatternBackground";
import { getThemeColorValueByName } from "~/utility/colors";

type Props = {
  options: BlockOptions;
  imageLink?: string | null;
};

const TextBanner = ({ options, imageLink }: Props) => {
  const navigate = useNavigate();
  const {
    align,
    alignMobile,
    backgroundBrightnessPrimary,
    backgroundColorPrimary,
    backgroundPatternColorPrimary,
    backgroundPatternNamePrimary,
    backgroundPatternSizePrimary,
    borderColor,
    borderRadius,
    borderSize,
    justify,
    justifyMobile,
    shortText,
    shortTextColor,
    shortTextFontWeight,
    shortTextFontWeightMobile,
    shortTextSize,
    shortTextSizeMobile,
    size,
    title,
    titleColor,
    titleFontWeight,
    titleFontWeightMobile,
    titleSize,
    titleSizeMobile,
  } = options || {};

  const smallStyle =
    "h-[146px] w-[1280px] max-xl:h-[124px] max-lg:h-[100px] max-md:h-[88px]";
  const mediumStyle =
    "h-[219px] w-[1280px] max-xl:h-[186px] max-lg:h-[125px] max-md:h-[132px]";
  const largeStyle =
    "h-[292px] w-[1400px] max-xl:h-[248px] max-lg:h-[224px] max-md:h-[196px]";

  let currentStyle = smallStyle;

  switch (size) {
    case "small":
      currentStyle = smallStyle;
      break;
    case "medium":
      currentStyle = mediumStyle;
      break;

    case "large":
      currentStyle = largeStyle;
      break;
    case "native":
      currentStyle = largeStyle;
      break;
  }

  return (
    <button
      type="button"
      onClick={() => imageLink && navigate(imageLink)}
      className={`relative mx-auto flex max-w-full select-none items-center justify-center 
      ${currentStyle} ${borderSize} ${borderColor} ${borderRadius}`}
    >
      <PatternBackground
        backgroundColor={
          backgroundColorPrimary
            ? getThemeColorValueByName(backgroundColorPrimary)
            : ""
        }
        brightness={backgroundBrightnessPrimary || undefined}
        name={backgroundPatternNamePrimary as BackgroundPatternName}
        patternColor={
          backgroundPatternColorPrimary
            ? getThemeColorValueByName(backgroundPatternColorPrimary)
            : ""
        }
        patternSize={backgroundPatternSizePrimary || 32}
      />

      <div
        className={`relative flex flex-col w-full gap-2 max-md:gap-1
          ${justify ? justify : "justify-center"} 
          ${align ? align : "items-center"}
          ${justifyMobile} ${alignMobile}`}
      >
        <h1
          className={`text-6xl max-md:text-4xl ${titleSize} ${titleSizeMobile}
              ${titleColor} ${titleFontWeight} ${titleFontWeightMobile}`}
        >
          {title}
        </h1>
        <h2
          className={`text-3xl max-md:text-lg ${shortTextSize} ${shortTextSizeMobile}
              ${shortTextColor} ${shortTextFontWeight} ${shortTextFontWeightMobile}`}
        >
          {shortText}
        </h2>
      </div>
    </button>
  );
};

export default TextBanner;
