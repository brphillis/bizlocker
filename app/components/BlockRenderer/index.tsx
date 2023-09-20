import BannerBlock from "../Blocks/BannerBlock";
import React from "react";
import TileBlock from "../Blocks/TileBlock";
import TextBlock from "../Blocks/TextBlock";
import ProductBlock from "../Blocks/ProductBlock";
import ArticleBlock from "../Blocks/ArticleBlock";
import HeroBlock from "../Blocks/HeroBlock";

type Props = {
  blocks: Block[];
  productBlockProducts?: Product[][];
  articleBlockArticles?: Article[][];
};

const BlockRenderer = ({
  blocks,
  productBlockProducts,
  articleBlockArticles,
}: Props) => {
  let productBlockCount = 0;
  let articleBlockCount = 0;

  return (
    <>
      {blocks?.map((_, i: number) => {
        const { name, content, blockOptions } = blocks[i] || {};

        switch (name) {
          case "hero":
            return (
              <React.Fragment key={"heroBlock_" + i}>
                <HeroBlock
                  content={content as Product | Image}
                  options={blockOptions[i] as BlockOptions}
                />
              </React.Fragment>
            );

          case "banner":
            return (
              <React.Fragment key={"bannerBlock_" + i}>
                <BannerBlock content={content} options={blockOptions} />
              </React.Fragment>
            );

          case "tile":
            return (
              <React.Fragment key={"tileBlock_" + i}>
                <TileBlock
                  content={content as Campaign[] | Promotion[]}
                  options={blockOptions}
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
            productBlockCount++;
            return (
              <React.Fragment key={"productBlock_" + i}>
                <ProductBlock
                  products={productBlockProducts?.[productBlockCount - 1]}
                  content={content as ProductBlockContent[]}
                  options={blockOptions[i] as BlockOptions}
                />
              </React.Fragment>
            );

          case "article":
            articleBlockCount++;
            return (
              <React.Fragment key={"articleBlock" + i}>
                <ArticleBlock
                  articles={articleBlockArticles?.[articleBlockCount - 1]}
                  content={content as ArticleBlockContent[]}
                  options={blockOptions[i] as BlockOptions}
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
