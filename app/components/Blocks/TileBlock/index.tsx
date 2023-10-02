import { useNavigate } from "@remix-run/react";
import PatternBackground from "~/components/Layout/PatternBackground";
import {
  buildContentImageFromContent,
  concatBlockContent,
  determineSingleContentType,
} from "~/helpers/blockContentHelpers";
import { generateColor } from "~/utility/colors";

type Props = {
  content: BlockContent;
  options: BlockOptions[];
};

const TileBlock = ({ content, options: ArrayOptions }: Props) => {
  const navigate = useNavigate();
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
  const itemColors = [
    colorOne,
    colorTwo,
    colorThree,
    colorFour,
    colorFive,
    colorSix,
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

        const { name, link, imageSrc } = buildContentImageFromContent(
          contentType!,
          contentData,
          "tileImage",
          links as string[],
          i
        );

        return (
          <div
            key={"tileImage_" + (name || i)}
            className={`relative flex aspect-square cursor-pointer items-center justify-center transition duration-300 ease-in-out hover:scale-[1.01] ${borderDisplay}`}
            style={{
              backgroundColor: itemColors[i]
                ? generateColor(itemColors[i]!)
                : "unset",
              borderRadius: borderRadius || "unset",
              border:
                borderSize && borderColor
                  ? `${borderSize} solid ${generateColor(borderColor)}`
                  : "unset",
            }}
          >
            <img
              className={`object-fit h-full w-full
                 ${filters[i]} 
                 ${borderRadius ? "p-3" : " "}
                 ${borderRadius === "100%" ? "max-md:!p-2" : " "}
                 ${
                   joinedContent.length % 2 !== 0
                     ? "max-sm:last:col-span-full"
                     : ""
                 }
                 `}
              onClick={() => link && navigate(link)}
              src={imageSrc}
              alt={name}
            />
          </div>
        );
      })}
    </div>
  );
};

export default TileBlock;
