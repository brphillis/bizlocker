import type { BlockOptions } from "@prisma/client";
import { getThemeColorValueByName } from "~/utility/colors";
import type {
  BlockContentWithDetails,
  BlockContentSorted,
} from "~/models/blocks.server";
import PatternBackground from "~/components/Layout/Backgrounds/PatternBackground";
import {
  buildImageFromBlockContent,
  getContentType,
} from "~/helpers/contentHelpers";
import IconTile from "./IconTile";
import ContentTile from "./ContentTile";

type Props = {
  content: BlockContentSorted[];
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
    itemLinks,
    margin,
    padding,
    itemBorderDisplays,
    itemBorderColors,
    itemBorderRadius,
    itemBorderSizes,
  } = options || {};

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

      {content?.map((contentData: BlockContentSorted, i: number) => {
        const contentType = getContentType(contentData);

        const { name, link, imageSrc } =
          buildImageFromBlockContent(contentData, "tileImage", itemLinks[i]) ||
          {};

        return (
          <div
            key={"tileImage_" + (name || i)}
            className={`relative flex aspect-square cursor-pointer items-center justify-center transition duration-300 ease-in-out hover:scale-[1.01] 
            ${itemBorderDisplays[i]} ${itemBorderRadius[i]} 
            ${itemBorderSizes[i]} ${itemBorderColors[i]} ${itemBorderColors[i]}
            ${content.length % 2 !== 0 ? "max-sm:last:col-span-full" : ""}`}
          >
            {contentType === "icon" && (
              <IconTile content={content} index={i} blockOptions={options} />
            )}

            {contentType !== "icon" && (
              <ContentTile
                index={i}
                blockOptions={options}
                imageSrc={imageSrc}
                imageLink={link}
                imageName={name}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TileBlock;
