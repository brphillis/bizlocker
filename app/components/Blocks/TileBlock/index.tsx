import type { BlockContent } from "~/models/blocks.server";
import type { BlockOptions } from "@prisma/client";
import PatternBackground from "~/components/Layout/PatternBackground";
import {
  buildContentImageFromContent,
  concatBlockContent,
  determineSingleContentType,
} from "~/helpers/blockContentHelpers";
import ContentTile from "./ContentTile";
import IconTile from "./IconTile";
import { getThemeColorValueByName } from "~/utility/colors";

type Props = {
  content: BlockContent;
  options: BlockOptions[];
};

const TileBlock = ({ content, options: ArrayOptions }: Props) => {
  const options = ArrayOptions[0];

  const {
    backgroundBrightness,
    backgroundColor,
    backgroundPatternColor,
    backgroundPatternName,
    backgroundPatternOpacity,
    backgroundPatternSize,
    backgroundWidth,
    columns,
    columnsMobile,
    itemBackgroundColors,
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
      className={`relative grid h-max place-items-center gap-3 py-6 max-md:px-3 sm:gap-6 ${margin} ${padding} 
      ${colsMobile || "max-md:!grid-cols-2"}`}
      style={{
        gridTemplateColumns: columns
          ? `repeat(${columns}, minmax(0, 1fr))`
          : "repeat(2, minmax(0, 1fr))",
      }}
    >
      <PatternBackground
        name={backgroundPatternName as BackgroundPatternName}
        backgroundColor={getThemeColorValueByName(backgroundColor)}
        patternColor={getThemeColorValueByName(backgroundPatternColor)}
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
            itemLinks[i]
          ) || {};

        console.log("current", itemBorderRadius[i]);

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
                itemBackgroundColor={itemBackgroundColors[i]}
              />
            )}

            {contentType !== "icon" && (
              <ContentTile
                borderRadius={itemBorderRadius[i]}
                filter={itemFilters[i]}
                imageSrc={imageSrc}
                itemBackgroundColor={itemBackgroundColors[i]}
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
