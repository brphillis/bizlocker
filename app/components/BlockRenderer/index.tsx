import { randomId } from "~/utility/stringHelpers";
import BannerBlock from "../Blocks/BannerBlock";
import React from "react";
import TileBlock from "../Blocks/TileBlock";
import TextBlock from "../Blocks/TextBlock";

type Props = {
  blocks: Block[];
};

const BlockRenderer = ({ blocks }: Props) => {
  console.log("blox", blocks);
  return (
    <>
      {blocks.map((_, index: number) => {
        const { content } = blocks[index];

        switch (blocks[index].name) {
          case "banner":
            return (
              <React.Fragment key={"bannerBlock_" + randomId()}>
                <BannerBlock content={content as Campaign[] | Promotion[]} />
              </React.Fragment>
            );

          case "tile":
            return (
              <React.Fragment key={"tileBlock_" + randomId()}>
                <TileBlock content={content as Campaign[] | Promotion[]} />
              </React.Fragment>
            );

          case "text":
            return (
              <React.Fragment key={"textBlock_" + randomId()}>
                <TextBlock content={content as string[]} />
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
