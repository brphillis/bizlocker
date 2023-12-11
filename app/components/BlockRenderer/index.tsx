import React from "react";
import type { PageBlock } from "~/models/pageBuilder.server";
import { blockMaster } from "~/utility/blockMaster/blockMaster";

type Props = {
  blocks: PageBlock[];
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
