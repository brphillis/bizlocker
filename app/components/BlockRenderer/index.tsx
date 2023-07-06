import { randomId } from "~/utility/stringHelpers";
import BannerBlock from "../Blocks/BannerBlock";
import React from "react";
import TileBlock from "../Blocks/TileBlock";

type Props = {
  blocks: Block[];
};

const BlockRenderer = ({ blocks }: Props) => {
  return (
    <>
      {blocks.map((_, index: number) => {
        const { content } = blocks[index];

        if (blocks[index].name === "banner") {
          return (
            <React.Fragment key={"bannerBlock_" + randomId()}>
              <BannerBlock content={content} />
            </React.Fragment>
          );
        }

        if (blocks[index].name === "tile") {
          return (
            <React.Fragment key={"tileBlock_" + randomId()}>
              <TileBlock content={content} />
            </React.Fragment>
          );
        } else return null;
      })}
    </>
  );
};

export default BlockRenderer;
