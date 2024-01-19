import React from "react";
import { ActionAlert } from "~/components/Notifications/Alerts";
import { capitalizeFirst } from "~/helpers/stringHelpers";
import {
  type BlockMaster,
  blockMaster,
} from "~/utility/blockMaster/blockMaster";
import type { BlockName } from "~/utility/blockMaster/types";
import BlockIcon from "./BlockIcon";

type Props = {
  setSelectedBlock: Function;
  selectedBlock: BlockName | undefined;
  selectedItems: ContentSelection[];
  setSelectedItems: Function;
};

const BlockSelect = ({
  setSelectedBlock,
  selectedBlock,
  selectedItems,
  setSelectedItems,
}: Props) => {
  const handleSelectBlock = (name: BlockName) => {
    if (selectedItems && selectedItems.length > 0) {
      ActionAlert(
        "Warning",
        "Discard Selected Items?",
        () => {
          setSelectedItems([]);
          setSelectedBlock(name as BlockName);
        },
        undefined,
        "warning",
      );
    } else {
      setSelectedBlock(name as BlockName);
    }
  };

  return (
    <div className="mx-auto flex max-w-full flex-wrap items-center justify-center gap-3 pt-6 pb-3">
      {blockMaster.map(({ name }: BlockMaster, i: number) => {
        return (
          <React.Fragment key={"BlockSelectionTiles_" + i}>
            <div
              onClick={() => handleSelectBlock(name as BlockName)}
              className={`flex h-24 w-24 cursor-pointer flex-col items-center gap-3 rounded-sm border border-brand-white/50 p-3 transition-all duration-300 ease-in-out hover:scale-[1.05]
           ${selectedBlock === name ? "scale-[1.05] border-primary" : ""}`}
            >
              <BlockIcon
                blockName={name}
                size={28}
                extendStyle="text-brand-white/75"
              />

              <p className="text-md text-brand-white/75">
                {capitalizeFirst(name)}
              </p>
            </div>
            <input type="hidden" name="blockName" value={selectedBlock || ""} />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default BlockSelect;
