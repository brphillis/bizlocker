import type { BlockOptions } from "@prisma/client";
import type { BlockContent } from "~/models/blocks.server";
import { useNavigate } from "@remix-run/react";
import PatternBackground from "~/components/Layout/PatternBackground";
import {
  buildContentImageFromContent,
  determineSingleContentType,
} from "~/helpers/blockContentHelpers";
import { getThemeColorValueByName } from "~/utility/colors";

type Props = {
  content: BlockContent;
  options?: BlockOptions[];
};

const BannerBlock = ({ content, options: ArrayOptions }: Props) => {
  const navigate = useNavigate();
  const options = ArrayOptions && ArrayOptions[0];
  const {
    backgroundColor,
    backgroundColorSecondary,
    backgroundBrightness,
    borderColor,
    borderDisplay,
    borderRadius,
    borderSize,
    margin,
    padding,
    primaryLink,
    size,
    title,
    titleColor,
    shortText,
    shortTextColor,
    backgroundPatternColor,
    backgroundPatternName,
    backgroundPatternOpacity,
    backgroundPatternSize,
  } = options || {};

  const contentType = determineSingleContentType(content as BlockContent);
  let name: string = "",
    link: string = "",
    imageSrc: string = "";

  if (contentType) {
    const imageProps = buildContentImageFromContent(
      contentType!,
      content,
      "bannerImage",
      primaryLink as string
    );
    name = imageProps.name;
    link = imageProps.link;
    imageSrc = imageProps.imageSrc;
  }

  const imageStyle = {
    cursor: link ? "pointer" : "auto",
  };

  return (
    <div
      className={`relative max-w-[100vw] overflow-visible sm:w-max ${margin} ${padding} ${borderDisplay} ${borderRadius}`}
    >
      <div
        className={`absolute left-[50%] top-0 z-0 h-full w-screen translate-x-[-50%] ${backgroundColorSecondary}`}
      ></div>

      {size && ["small", undefined].includes(size) && imageSrc && (
        <img
          onClick={() => link && navigate(link)}
          src={imageSrc}
          alt={name}
          className={`relative mx-auto block h-[146px] w-full max-w-[1280px] overflow-hidden object-cover max-xl:h-[124px] max-lg:h-[100px] max-md:h-[88px]
          ${borderSize} ${borderColor} ${borderRadius}
          ${backgroundColorSecondary ? "h-[170px] py-3" : " "}`}
          style={imageStyle}
        />
      )}

      {size && ["small", undefined].includes(size) && !imageSrc && (
        <div
          onClick={() => link && navigate(link)}
          className={`relative mx-auto flex h-[146px] w-[1280px] max-w-full select-none items-center justify-center max-xl:h-[124px] max-lg:h-[100px] max-md:h-[88px]
          ${borderSize} ${borderColor} ${borderRadius}
          `}
          style={imageStyle}
        >
          <PatternBackground
            name={backgroundPatternName as BackgroundPatternName}
            backgroundColor={
              backgroundColor ? getThemeColorValueByName(backgroundColor) : ""
            }
            patternColor={
              backgroundPatternColor
                ? getThemeColorValueByName(backgroundPatternColor)
                : ""
            }
            patternOpacity={backgroundPatternOpacity || 0.5}
            patternSize={backgroundPatternSize || 32}
            brightness={backgroundBrightness || undefined}
          />
          <div className="relative flex flex-col items-center">
            <h1 className={`text-4xl max-md:text-2xl ${titleColor}`}>
              {title}
            </h1>
            <h2 className={`text-2xl max-md:text-lg ${shortTextColor}`}>
              {shortText}
            </h2>
          </div>
        </div>
      )}

      {size === "medium" && imageSrc && (
        <img
          onClick={() => link && navigate(link)}
          src={imageSrc}
          alt={name}
          className={`relative mx-auto block h-[219px] w-full max-w-[1280px] object-cover max-xl:h-[186px] max-lg:h-[125px] max-md:h-[132px]
          ${borderSize} ${borderColor} ${borderRadius}
          ${backgroundColorSecondary ? "h-[243px] py-3" : " "}`}
          style={imageStyle}
        />
      )}

      {size && ["medium", undefined].includes(size) && !imageSrc && (
        <div
          onClick={() => link && navigate(link)}
          className={`relative mx-auto flex h-[219px] w-[1280px] max-w-full select-none items-center justify-center max-xl:h-[186px] max-lg:h-[125px] max-md:h-[132px]
          ${borderSize} ${borderColor} ${borderRadius}`}
          style={imageStyle}
        >
          <PatternBackground
            name={backgroundPatternName as BackgroundPatternName}
            backgroundColor={
              backgroundColor ? getThemeColorValueByName(backgroundColor) : ""
            }
            patternColor={
              backgroundPatternColor
                ? getThemeColorValueByName(backgroundPatternColor)
                : ""
            }
            patternOpacity={backgroundPatternOpacity || 0.5}
            patternSize={backgroundPatternSize || 32}
            brightness={backgroundBrightness || undefined}
          />
          <div className="relative flex flex-col items-center gap-2 max-md:gap-1">
            <h1 className={`text-6xl max-md:text-4xl ${titleColor}`}>
              {title}
            </h1>
            <h2 className={`text-3xl max-md:text-lg ${shortTextColor}`}>
              {shortText}
            </h2>
          </div>
        </div>
      )}

      {size === "large" && imageSrc && (
        <img
          onClick={() => link && navigate(link)}
          src={imageSrc}
          alt={name}
          className={`relative h-[292px] w-[1400px] max-w-[1280px] object-cover max-xl:h-[248px] max-lg:h-[224px] max-md:h-[196px] 
          ${borderSize} ${borderColor} ${borderRadius}`}
          style={imageStyle}
        />
      )}

      {size && ["large", "native", undefined].includes(size) && !imageSrc && (
        <div
          onClick={() => link && navigate(link)}
          className={`relative mx-auto flex h-[292px] w-[1400px] max-w-full select-none items-center justify-center max-xl:h-[248px] max-lg:h-[224px] max-md:h-[196px]
          ${borderSize} ${borderColor} ${borderRadius}`}
          style={imageStyle}
        >
          <PatternBackground
            name={backgroundPatternName as BackgroundPatternName}
            backgroundColor={
              backgroundColor ? getThemeColorValueByName(backgroundColor) : ""
            }
            patternColor={
              backgroundPatternColor
                ? getThemeColorValueByName(backgroundPatternColor)
                : ""
            }
            patternOpacity={backgroundPatternOpacity || 0.5}
            patternSize={backgroundPatternSize || 32}
            brightness={backgroundBrightness || undefined}
          />

          <div className="relative flex flex-col items-center gap-3 max-md:gap-2">
            <h1 className={`text-7xl max-md:text-4xl ${titleColor}`}>
              {title}
            </h1>
            <h2 className={`text-4xl max-md:text-lg ${shortTextColor}`}>
              {shortText}
            </h2>
          </div>
        </div>
      )}

      {size === "native" && imageSrc && (
        <img
          onClick={() => link && navigate(link)}
          src={imageSrc}
          alt={name}
          className={`relative object-cover shadow-md max-xl:h-[248px] max-lg:h-[224px] max-md:h-[148px] 
          ${borderSize} ${borderColor} ${borderRadius}
          ${backgroundColorSecondary ? "h-[272px] py-3" : " "}
          `}
          style={imageStyle}
        />
      )}
    </div>
  );
};

export default BannerBlock;
