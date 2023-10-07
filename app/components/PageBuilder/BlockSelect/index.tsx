import React from "react";
import BlockIcon from "~/components/Blocks/BlockIcon";
import { capitalizeFirst } from "~/helpers/stringHelpers";
import { blockMaster } from "~/utility/blockMaster";

type Props = {
  setSelectedBlock: Function;
  selectedBlock: BlockName | undefined;
};

const BlockSelect = ({ setSelectedBlock, selectedBlock }: Props) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {blockMaster.map(({ name }: BlockMaster, i: number) => {
        return (
          <React.Fragment key={"BlockSelection_" + { name }}>
            <div
              onClick={() => setSelectedBlock(name as BlockName)}
              className={`flex h-24 w-24 cursor-pointer flex-col items-center gap-3 rounded-sm border border-brand-white/50 p-3 transition-all duration-300 ease-in-out hover:scale-[1.05]
           ${selectedBlock === name ? "scale-[1.05] border-primary" : ""}`}
            >
              <BlockIcon blockName={name} size={28} />

              <p className="text-md text-brand-white/75">
                {capitalizeFirst(name)}
              </p>
            </div>
            <input type="hidden" name="blockName" value={selectedBlock} />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default BlockSelect;
