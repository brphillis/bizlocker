import PatternBackground from "~/components/Layout/PatternBackground";
import {
  buildContentImageFromContent,
  concatBlockContent,
  determineSingleContentType,
  getItemOption,
} from "~/helpers/blockContentHelpers";
import { generateColor } from "~/utility/colors";
import ContentTile from "./ContentTile";
import IconTile from "./IconTile";

type Props = {
  content: BlockContent;
  options: BlockOptions[];
};

const TileBlock = ({ content, options: ArrayOptions }: Props) => {
  const options = ArrayOptions[0];

  const {
    backgroundBrightness,
    backgroundColor,
    borderRadius,
    columns,
    columnsMobile,
    margin,
    padding,
    backgroundPatternColor,
    backgroundPatternName,
    backgroundPatternOpacity,
    backgroundPatternSize,
    backgroundWidth,
    borderColor,
    borderSize,
    borderDisplay,
  } = options || {};

  const joinedContent = concatBlockContent(content);
  const colsMobile = `max-md:!grid-cols-${columnsMobile}`;

  return (
    <div
      className={`relative grid h-max place-items-center gap-3 px-3 sm:gap-6 ${margin} ${padding} ${
        colsMobile || "max-md:!grid-cols-2"
      }`}
      style={{
        gridTemplateColumns: columns
          ? `repeat(${columns}, minmax(0, 1fr))`
          : "repeat(2, minmax(0, 1fr))",
        paddingTop: backgroundColor ? "24px" : "unset",
        paddingBottom: backgroundColor ? "24px" : "unset",
      }}
    >
      <PatternBackground
        name={backgroundPatternName as BackgroundPatternName}
        backgroundColor={generateColor(backgroundColor)}
        patternColor={
          backgroundPatternColor ? generateColor(backgroundPatternColor) : ""
        }
        patternOpacity={backgroundPatternOpacity || 0.5}
        patternSize={backgroundPatternSize || 32}
        screenWidth={backgroundWidth === "100vw" ? true : false}
        brightness={backgroundBrightness || undefined}
      />

      {joinedContent?.map((contentData: any, i: number) => {
        const contentType = determineSingleContentType(
          contentData as BlockContent
        );

        const { name, link, imageSrc } =
          buildContentImageFromContent(
            contentType!,
            contentData,
            "tileImage",
            getItemOption(options, "link", i)
          ) || {};

        return (
          <div
            key={"tileImage_" + (name || i)}
            className={`relative flex aspect-square cursor-pointer items-center justify-center transition duration-300 ease-in-out hover:scale-[1.01] ${borderDisplay}
            ${joinedContent.length % 2 !== 0 ? "max-sm:last:col-span-full" : ""}
            `}
            style={{
              backgroundColor: getItemOption(options, "colorSecondary", i)
                ? generateColor(getItemOption(options, "colorSecondary", i))
                : "unset",
              borderRadius: borderRadius || "unset",
              border:
                borderSize && borderColor
                  ? `${borderSize} solid ${generateColor(borderColor)}`
                  : "unset",
            }}
          >
            {contentType === "icon" && (
              <IconTile
                borderRadius={borderRadius}
                filter={getItemOption(options, "filter", i)}
                imageSrc={imageSrc}
                index={i}
                title={getItemOption(options, "title", i)}
                joinedContent={joinedContent}
                link={getItemOption(options, "link", i)}
                name={name}
                itemColor={getItemOption(options, "color", i)}
              />
            )}

            {contentType !== "icon" && (
              <ContentTile
                borderRadius={borderRadius}
                filter={getItemOption(options, "filter", i)}
                imageSrc={imageSrc}
                itemSecondaryColor={getItemOption(options, "colorSecondary", i)}
                joinedContent={joinedContent}
                link={link}
                name={name}
                contentType={contentType}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TileBlock;
