import React from "react";
import { blockMaster } from "~/utility/blockMaster";

type Props = {
  blocks: Block[];
};

const BlockRenderer = ({ blocks }: Props) => {
  return (
    <>
      {blocks?.map(({ name, content, blockOptions }, i) => {
        const blockConfig = blockMaster?.find((e) => e.name === name);
        if (!blockConfig) {
          return null;
        }
        const Component = blockConfig?.component;
        return (
          <React.Fragment key={`${name}Block_${i}`}>
            <Component content={content} options={blockOptions} />
          </React.Fragment>
        );
      })}
    </>
  );
};

export default BlockRenderer;
