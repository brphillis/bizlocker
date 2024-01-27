import React from "react";
import { sortBlockContent } from "~/helpers/contentHelpers";
import { BlockWithContent } from "~/models/Blocks/types";
import { blockMaster } from "~/utility/blockMaster/blockMaster";

type Props = {
  blocks: BlockWithContent[];
};

const BlockRenderer = ({ blocks }: Props) => {
  return (
    <>
      {blocks?.map(({ name, contentOrder, content, blockOptions }, i) => {
        const blockConfig = blockMaster?.find((e) => e.name === name);
        if (!blockConfig) {
          return null;
        }
        const Component = blockConfig?.component;
        return (
          <React.Fragment key={`${name}Block_${i}`}>
            {content && (
              <Component
                content={sortBlockContent(contentOrder, content)}
                options={blockOptions}
              />
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default BlockRenderer;
