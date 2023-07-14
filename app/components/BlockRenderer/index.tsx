import BannerBlock from "../Blocks/BannerBlock";
import React from "react";
import TileBlock from "../Blocks/TileBlock";
import TextBlock from "../Blocks/TextBlock";
import ProductBlock from "../Blocks/ProductBlock";

type Props = {
  blocks: Block[];
};

const BlockRenderer = ({ blocks }: Props) => {
  return (
    <>
      {blocks.map((_, index: number) => {
        const blockName = blocks[index].name;
        const { content } = blocks[index];
        const { blockOptions } = blocks[index];

        switch (blockName) {
          case "banner":
            const contentData = content as Campaign[] | Promotion[];

            const { bannerImage } = contentData[0] as Campaign | Promotion;
            return (
              <React.Fragment key={"bannerBlock_" + index}>
                <BannerBlock image={bannerImage} />
              </React.Fragment>
            );

          case "tile":
            return (
              <React.Fragment key={"tileBlock_" + index}>
                <TileBlock content={content as Campaign[] | Promotion[]} />
              </React.Fragment>
            );

          case "text":
            return (
              <React.Fragment key={"textBlock_" + index}>
                <TextBlock content={content as string[]} />
              </React.Fragment>
            );

          case "product":
            return (
              <React.Fragment key={"productBlock_" + index}>
                <ProductBlock
                  content={content as ProductBlockContent[]}
                  options={blockOptions as BlockOptions}
                />
              </React.Fragment>
            );

          default:
            return null;
        }
      })}
    </>
  );
};

export default BlockRenderer;
