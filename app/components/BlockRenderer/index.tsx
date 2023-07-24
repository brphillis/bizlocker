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
      {blocks.map((_, i: number) => {
        const { name, content, blockOptions, type } = blocks[i] || {};

        switch (name) {
          case "banner":
            const contentData = content as Campaign[] | Promotion[];

            const { bannerImage } = contentData[0] as Campaign | Promotion;
            const contentName = contentData[0]?.name;
            const url = type && contentName && `/${type}/${contentName}`;
            return (
              <React.Fragment key={"bannerBlock_" + i}>
                <BannerBlock image={bannerImage} url={url} />
              </React.Fragment>
            );

          case "tile":
            return (
              <React.Fragment key={"tileBlock_" + i}>
                <TileBlock
                  content={content as Campaign[] | Promotion[]}
                  options={blockOptions as BlockOptions}
                />
              </React.Fragment>
            );

          case "text":
            return (
              <React.Fragment key={"textBlock_" + i}>
                <TextBlock content={content as string[]} />
              </React.Fragment>
            );

          case "product":
            return (
              <React.Fragment key={"productBlock_" + i}>
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
