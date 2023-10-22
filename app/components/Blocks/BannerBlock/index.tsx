import { useNavigate } from "@remix-run/react";
import PatternBackground from "~/components/Layout/PatternBackground";
import {
  buildContentImageFromContent,
  determineSingleContentType,
} from "~/helpers/blockContentHelpers";
import { generateColor } from "~/utility/colors";

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
    link1,
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
      link1 as string
    );
    name = imageProps.name;
    link = imageProps.link;
    imageSrc = imageProps.imageSrc;
  }

  const imageStyle = {
    cursor: link ? "pointer" : "auto",
    borderRadius: borderRadius || "unset",
    border:
      borderSize && borderColor
        ? `${borderSize} solid ${generateColor(borderColor)}`
        : "unset",
  };

  return (
    <div
      className={`relative max-w-[100vw] overflow-visible sm:w-max ${margin} ${padding} ${borderDisplay}`}
      style={{
        borderRadius: borderRadius || "unset",
        paddingTop: backgroundColor && !imageSrc ? "1.5rem" : "unset",
        paddingBottom: backgroundColor && !imageSrc ? "1.5rem" : "unset",
      }}
    >
      <div
        className="absolute left-[50%] top-0 z-0 h-full w-screen translate-x-[-50%]"
        style={{ backgroundColor: generateColor(backgroundColorSecondary) }}
      ></div>

      {["small", undefined].includes(size) && imageSrc && (
        <img
          onClick={() => link && navigate(link)}
          src={imageSrc}
          alt={name}
          className={`relative mx-auto block h-[146px] w-full max-w-[1280px] overflow-hidden object-cover max-xl:h-[124px] max-lg:h-[100px] max-md:h-[88px]
          ${backgroundColorSecondary ? "h-[170px] py-3" : " "}`}
          style={imageStyle}
        />
      )}

      {["small", undefined].includes(size) && !imageSrc && (
        <div
          onClick={() => link && navigate(link)}
          className="relative mx-auto flex h-[146px] w-[1280px] max-w-full select-none items-center justify-center max-xl:h-[124px] max-lg:h-[100px] max-md:h-[88px]"
          style={imageStyle}
        >
          <PatternBackground
            name={backgroundPatternName as BackgroundPatternName}
            backgroundColor={generateColor(backgroundColor)}
            patternColor={
              backgroundPatternColor
                ? generateColor(backgroundPatternColor)
                : ""
            }
            patternOpacity={backgroundPatternOpacity || 0.5}
            patternSize={backgroundPatternSize || 32}
            brightness={backgroundBrightness || undefined}
          />
          <div className="relative flex flex-col items-center">
            <h1
              className="text-4xl max-md:text-2xl"
              style={{ color: generateColor(titleColor) }}
            >
              {title}
            </h1>
            <h2
              className="text-2xl max-md:text-lg"
              style={{ color: generateColor(shortTextColor) }}
            >
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
          ${backgroundColorSecondary ? "h-[243px] py-3" : " "}`}
          style={imageStyle}
        />
      )}

      {["medium", undefined].includes(size) && !imageSrc && (
        <div
          onClick={() => link && navigate(link)}
          className="relative mx-auto flex h-[219px] w-[1280px] max-w-full select-none items-center justify-center max-xl:h-[186px] max-lg:h-[125px] max-md:h-[132px]"
          style={imageStyle}
        >
          <PatternBackground
            name={backgroundPatternName as BackgroundPatternName}
            backgroundColor={generateColor(backgroundColor)}
            patternColor={
              backgroundPatternColor
                ? generateColor(backgroundPatternColor)
                : ""
            }
            patternOpacity={backgroundPatternOpacity || 0.5}
            patternSize={backgroundPatternSize || 32}
            brightness={backgroundBrightness || undefined}
          />
          <div className="relative flex flex-col items-center gap-2 max-md:gap-1">
            <h1
              className="text-6xl max-md:text-4xl"
              style={{ color: generateColor(titleColor) }}
            >
              {title}
            </h1>
            <h2
              className="text-3xl max-md:text-lg"
              style={{ color: generateColor(shortTextColor) }}
            >
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
          className="relative h-[292px] w-[1400px] max-w-[1280px] object-cover max-xl:h-[248px] max-lg:h-[224px] max-md:h-[196px]"
          style={imageStyle}
        />
      )}

      {["large", "native", undefined].includes(size) && !imageSrc && (
        <div
          onClick={() => link && navigate(link)}
          className="relative mx-auto flex h-[292px] w-[1400px] max-w-full select-none items-center justify-center max-xl:h-[248px] max-lg:h-[224px] max-md:h-[196px]"
          style={imageStyle}
        >
          <PatternBackground
            name={backgroundPatternName as BackgroundPatternName}
            backgroundColor={generateColor(backgroundColor)}
            patternColor={
              backgroundPatternColor
                ? generateColor(backgroundPatternColor)
                : ""
            }
            patternOpacity={backgroundPatternOpacity || 0.5}
            patternSize={backgroundPatternSize || 32}
            brightness={backgroundBrightness || undefined}
          />

          <div className="relative flex flex-col items-center gap-3 max-md:gap-2">
            <h1
              className="text-7xl max-md:text-4xl"
              style={{ color: generateColor(titleColor) }}
            >
              {title}
            </h1>
            <h2
              className="text-4xl max-md:text-lg"
              style={{ color: generateColor(shortTextColor) }}
            >
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
          ${backgroundColorSecondary ? "h-[272px] py-3" : " "}
          `}
          style={imageStyle}
        />
      )}
    </div>
  );
};

export default BannerBlock;
