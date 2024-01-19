import type { BlockContentWithDetails } from "~/models/blocks.server";
import type { BlockOptions } from "@prisma/client";
import PatternBackground from "~/components/Layout/Backgrounds/PatternBackground";
import {
  buildImageFromBlockContent,
  concatBlockContent,
  determineContentType,
} from "~/helpers/contentHelpers";
import ContentTile from "./ContentTile";
import IconTile from "./IconTile";
import { getThemeColorValueByName } from "~/utility/colors";

type Props = {
  content: BlockContentWithDetails;
  options: BlockOptions[];
};

const TileBlock = ({ content, options: ArrayOptions }: Props) => {
  const options = ArrayOptions[0];

  const {
    backgroundBrightnessPrimary,
    backgroundColorPrimary,
    backgroundPatternColorPrimary,
    backgroundPatternNamePrimary,
    backgroundPatternSizePrimary,
    backgroundWidthPrimary,
    columns,
    columnsMobile,
    itemBackgroundColorsPrimary,
    itemColors,
    itemFilters,
    itemLinks,
    itemTitleColors,
    itemTitles,
    margin,
    padding,
    itemBorderDisplays,
    itemBorderColors,
    itemBorderRadius,
    itemBorderSizes,
  } = options || {};

  const joinedContent = concatBlockContent(content);
  const colsMobile = `max-md:!grid-cols-${columnsMobile}`;

  return (
    <div
      className={`relative grid h-max place-items-center gap-6 max-md:gap-3 max-md:px-3 
      ${!columns || (columns && columns <= 3) ? "py-6" : "py-3"}
      ${
        backgroundWidthPrimary !== "w-screen"
          ? backgroundColorPrimary
            ? columns && columns <= 3
              ? "px-6"
              : "py-3"
            : ""
          : ""
      }
      ${margin} ${padding} 
      ${colsMobile || "max-md:!grid-cols-2"}`}
      style={{
        gridTemplateColumns: columns
          ? `repeat(${columns}, minmax(0, 1fr))`
          : "repeat(2, minmax(0, 1fr))",
      }}
    >
      <PatternBackground
        name={backgroundPatternNamePrimary as BackgroundPatternName}
        backgroundColor={getThemeColorValueByName(backgroundColorPrimary)}
        patternColor={getThemeColorValueByName(backgroundPatternColorPrimary)}
        patternSize={backgroundPatternSizePrimary || 32}
        screenWidth={backgroundWidthPrimary === "w-screen" ? true : false}
        brightness={backgroundBrightnessPrimary || undefined}
      />

      {joinedContent?.map((contentData: any, i: number) => {
        const contentType = determineContentType(
          contentData as BlockContentWithDetails,
        );

        const { name, link, imageSrc } =
          buildImageFromBlockContent(contentData, "tileImage", itemLinks[i]) ||
          {};

        return (
          <div
            key={"tileImage_" + (name || i)}
            className={`relative flex aspect-square cursor-pointer items-center justify-center transition duration-300 ease-in-out hover:scale-[1.01] 
            ${itemBorderDisplays[i]} ${itemBorderRadius[i]} 
            ${itemBorderSizes[i]} ${itemBorderColors[i]} ${itemBorderColors[i]}
            ${
              joinedContent.length % 2 !== 0 ? "max-sm:last:col-span-full" : ""
            }`}
          >
            {contentType === "icon" && (
              <IconTile
                borderRadius={itemBorderRadius[i]}
                filter={itemFilters[i]}
                imageSrc={imageSrc}
                index={i}
                title={itemTitles[i]}
                joinedContent={joinedContent}
                link={itemLinks[i]}
                name={name}
                itemColor={itemColors[i]}
                itemTitleColor={itemTitleColors[i]}
                itemBackgroundColor={itemBackgroundColorsPrimary[i]}
              />
            )}

            {contentType !== "icon" && (
              <ContentTile
                borderRadius={itemBorderRadius[i]}
                filter={itemFilters[i]}
                imageSrc={imageSrc}
                itemBackgroundColor={itemBackgroundColorsPrimary[i]}
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
