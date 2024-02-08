import { BlockOptions } from "@prisma/client";
import { BlockContentSorted } from "~/models/Blocks/types";
import {
  buildImageFromBlockContent,
  getContentType,
} from "~/helpers/contentHelpers";
import IconTile from "./IconTile";
import ContentTile from "./ContentTile";
import Title from "../_BlockComponents/Title";
import Container from "../_BlockComponents/Container";
import TextTile from "./TextTile";

type Props = {
  content: BlockContentSorted[];
  options: BlockOptions[];
};

const TileBlock = ({ content, options }: Props) => {
  const {
    columns,
    columnsMobile,
    itemLinks,
    title,
    itemBorderDisplays,
    itemBorderColors,
    itemBorderRadius,
    itemBorderSizes,
  } = options[0] || {};

  return (
    <Container options={options[0]}>
      <>{title && <Title blockOptions={options[0]} />}</>

      <div
        className={`relative grid place-items-center gap-6 max-md:gap-x-3 max-md:gap-y-6
        ${columns} ${columnsMobile}`}
      >
        {content?.map((contentData: BlockContentSorted, i: number) => {
          const contentType = getContentType(contentData);

          const { name, link, imageSrc } =
            buildImageFromBlockContent(
              contentData,
              "tileImage",
              itemLinks[i],
            ) || {};

          return (
            <div
              key={"tileImage_" + name + "_" + i}
              className={`relative w-full h-full flex items-center justify-center transition duration-300 ease-in-out hover:scale-[1.01] 
              ${itemBorderDisplays[i]} ${itemBorderRadius[i]} 
              ${itemBorderSizes[i]} ${itemBorderColors[i]} ${
                itemBorderColors[i]
              }
              ${itemLinks[i] ? "cursor-pointer" : ""}
              ${content.length % 2 !== 0 ? "max-sm:last:col-span-full" : ""}`}
            >
              {contentType === "icon" && (
                <IconTile
                  content={content}
                  index={i}
                  blockOptions={options[0]}
                />
              )}

              {contentType === "other" && (
                <TextTile index={i} blockOptions={options[0]} />
              )}

              {contentType !== "icon" && contentType !== "other" && (
                <ContentTile
                  index={i}
                  blockOptions={options[0]}
                  imageSrc={imageSrc}
                  imageLink={link}
                  imageName={name}
                />
              )}
            </div>
          );
        })}
      </div>
    </Container>
  );
};

export default TileBlock;
