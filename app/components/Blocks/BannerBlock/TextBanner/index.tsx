import type { BlockOptions } from "@prisma/client";
import { useNavigate } from "@remix-run/react";
import PatternBackground from "~/components/Layout/Backgrounds/PatternBackground";
import { getThemeColorValueByName } from "~/utility/colors";

type Props = {
  options: BlockOptions;
  imageLink: string | null;
};

const TextBanner = ({ options, imageLink }: Props) => {
  const navigate = useNavigate();
  const {
    backgroundPatternNamePrimary,
    backgroundColorPrimary,
    backgroundPatternColorPrimary,
    backgroundPatternSizePrimary,
    backgroundBrightnessPrimary,
    borderColor,
    borderRadius,
    borderSize,
    size,
    titleColor,
    titleFontWeight,
    titleFontWeightMobile,
    shortTextColor,
    title,
    shortText,
  } = options || {};

  return (
    <>
      {size === "small" && (
        <div
          onClick={() => imageLink && navigate(imageLink)}
          className={`relative mx-auto flex h-[146px] w-[1280px] max-w-full select-none items-center justify-center max-xl:h-[124px] max-lg:h-[100px] max-md:h-[88px]
          ${borderSize} ${borderColor} ${borderRadius}
          `}
        >
          <PatternBackground
            name={backgroundPatternNamePrimary as BackgroundPatternName}
            backgroundColor={
              backgroundColorPrimary
                ? getThemeColorValueByName(backgroundColorPrimary)
                : ""
            }
            patternColor={
              backgroundPatternColorPrimary
                ? getThemeColorValueByName(backgroundPatternColorPrimary)
                : ""
            }
            patternSize={backgroundPatternSizePrimary || 32}
            brightness={backgroundBrightnessPrimary || undefined}
          />
          <div className="relative flex flex-col items-center">
            <h1
              className={`text-4xl max-md:text-2xl 
              ${titleColor} ${titleFontWeight} ${titleFontWeightMobile}`}
            >
              {title}
            </h1>
            <h2 className={`text-2xl max-md:text-lg ${shortTextColor}`}>
              {shortText}
            </h2>
          </div>
        </div>
      )}

      {(!size || size === "medium") && (
        <div
          onClick={() => imageLink && navigate(imageLink)}
          className={`relative mx-auto flex h-[219px] w-[1280px] max-w-full select-none items-center justify-center max-xl:h-[186px] max-lg:h-[125px] max-md:h-[132px]
          ${borderSize} ${borderColor} ${borderRadius}`}
        >
          <PatternBackground
            name={backgroundPatternNamePrimary as BackgroundPatternName}
            backgroundColor={
              backgroundColorPrimary
                ? getThemeColorValueByName(backgroundColorPrimary)
                : ""
            }
            patternColor={
              backgroundPatternColorPrimary
                ? getThemeColorValueByName(backgroundPatternColorPrimary)
                : ""
            }
            patternSize={backgroundPatternSizePrimary || 32}
            brightness={backgroundBrightnessPrimary || undefined}
          />
          <div className="relative flex flex-col items-center gap-2 max-md:gap-1">
            <h1
              className={`text-6xl max-md:text-4xl 
              ${titleColor} ${titleFontWeight} ${titleFontWeightMobile}`}
            >
              {title}
            </h1>
            <h2 className={`text-3xl max-md:text-lg ${shortTextColor}`}>
              {shortText}
            </h2>
          </div>
        </div>
      )}

      {(size === "large" || size === "native") && (
        <div
          onClick={() => imageLink && navigate(imageLink)}
          className={`relative mx-auto flex h-[292px] w-[1400px] max-w-full select-none items-center justify-center max-xl:h-[248px] max-lg:h-[224px] max-md:h-[196px]
          ${borderSize} ${borderColor} ${borderRadius}`}
        >
          <PatternBackground
            name={backgroundPatternNamePrimary as BackgroundPatternName}
            backgroundColor={
              backgroundColorPrimary
                ? getThemeColorValueByName(backgroundColorPrimary)
                : ""
            }
            patternColor={
              backgroundPatternColorPrimary
                ? getThemeColorValueByName(backgroundPatternColorPrimary)
                : ""
            }
            patternSize={backgroundPatternSizePrimary || 32}
            brightness={backgroundBrightnessPrimary || undefined}
          />

          <div className="relative flex flex-col items-center gap-3 max-md:gap-2">
            <h1
              className={`text-7xl max-md:text-4xl 
            ${titleColor} ${titleFontWeight} ${titleFontWeightMobile}`}
            >
              {title}
            </h1>
            <h2 className={`text-4xl max-md:text-lg ${shortTextColor}`}>
              {shortText}
            </h2>
          </div>
        </div>
      )}
    </>
  );
};

export default TextBanner;
