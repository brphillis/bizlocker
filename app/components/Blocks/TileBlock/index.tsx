import PatternBackground from "~/components/Layout/PatternBackground";
import {
  buildContentImageFromContent,
  concatBlockContent,
  determineSingleContentType,
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
  const columns = options?.columns || 2;

  const {
    backgroundBrightness,
    backgroundColor,
    borderRadius,
    colorFive,
    colorFour,
    colorOne,
    colorSix,
    colorThree,
    colorTwo,
    colorSecondaryFive,
    colorSecondaryFour,
    colorSecondaryOne,
    colorSecondarySix,
    colorSecondaryThree,
    colorSecondaryTwo,
    columnsMobile,
    filterFive,
    filterFour,
    filterOne,
    filterSix,
    filterThree,
    filterTwo,
    linkFive,
    linkFour,
    linkOne,
    linkSix,
    linkThree,
    linkTwo,
    margin,
    padding,
    backgroundPatternColor,
    backgroundPatternName,
    backgroundPatternOpacity,
    backgroundPatternSize,
    borderColor,
    borderSize,
    borderDisplay,
    titleOne,
    titleTwo,
    titleThree,
    titleFour,
    titleFive,
    titleSix,
  } = options || {};

  const links = [linkOne, linkTwo, linkThree, linkFour, linkFive, linkSix];
  const filters = [
    filterOne,
    filterTwo,
    filterThree,
    filterFour,
    filterFive,
    filterSix,
  ];
  const itemTitles = [
    titleOne,
    titleTwo,
    titleThree,
    titleFour,
    titleFive,
    titleSix,
  ];
  const itemColors = [
    colorOne,
    colorTwo,
    colorThree,
    colorFour,
    colorFive,
    colorSix,
  ];
  const itemSecondaryColors = [
    colorSecondaryOne,
    colorSecondaryTwo,
    colorSecondaryThree,
    colorSecondaryFour,
    colorSecondaryFive,
    colorSecondarySix,
  ];

  const joinedContent = concatBlockContent(content);
  const colsMobile = `max-md:!grid-cols-${columnsMobile}`;

  return (
    <div
      className={`relative grid h-max place-items-center gap-3 px-3 sm:gap-6 lg:px-0 ${margin} ${padding} ${
        colsMobile || "max-md:!grid-cols-2"
      }`}
      style={{
        gridTemplateColumns: columns
          ? `repeat(${columns}, minmax(0, 1fr))`
          : "repeat(2, minmax(0, 1fr))",
        paddingTop: backgroundColor ? "1.5rem" : "unset",
        paddingBottom: backgroundColor ? "1.5rem" : "unset",
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
        screenWidth={true}
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
            links as string[],
            i
          ) || {};

        return (
          <div
            key={"tileImage_" + (name || i)}
            className={`relative flex aspect-square cursor-pointer items-center justify-center transition duration-300 ease-in-out hover:scale-[1.01] ${borderDisplay}`}
            style={{
              backgroundColor: itemSecondaryColors[i]
                ? generateColor(itemSecondaryColors[i]!)
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
                filters={filters}
                imageSrc={imageSrc}
                index={i}
                itemTitles={itemTitles}
                joinedContent={joinedContent}
                links={links}
                name={name}
                itemColors={itemColors}
              />
            )}

            {contentType !== "icon" && (
              <ContentTile
                borderRadius={borderRadius}
                filters={filters}
                imageSrc={imageSrc}
                index={i}
                itemSecondaryColors={itemSecondaryColors}
                joinedContent={joinedContent}
                link={link}
                name={name}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TileBlock;
