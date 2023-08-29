import BannerBlock from "../Blocks/BannerBlock";
import React from "react";
import TileBlock from "../Blocks/TileBlock";
import TextBlock from "../Blocks/TextBlock";
import ProductBlock from "../Blocks/ProductBlock";
import ArticleBlock from "../Blocks/ArticleBlock";

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
            return (
              <React.Fragment key={"bannerBlock_" + i}>
                <BannerBlock
                  content={content[0] as Campaign | Promotion | ContentImage}
                  type={type}
                  options={blockOptions as BlockOptions}
                />
              </React.Fragment>
            );

          case "tile":
            return (
              <React.Fragment key={"tileBlock_" + i}>
                <TileBlock
                  content={content as Campaign[] | Promotion[]}
                  type={type}
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

          case "article":
            return (
              <React.Fragment key={"articleBlock" + i}>
                <ArticleBlock
                  content={content as ArticleBlockContent[]}
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
