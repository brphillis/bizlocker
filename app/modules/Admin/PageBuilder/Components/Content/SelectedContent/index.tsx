import React from "react";
import type { BlockName } from "~/utility/blockMaster/types";
import { blockMaster } from "~/utility/blockMaster/blockMaster";
import ContentCard from "./ContentCard";
import { useNavigate } from "@remix-run/react";

type Props = {
  selectedItems: ContentSelection[];
  setSelectedItems: React.Dispatch<React.SetStateAction<ContentSelection[]>>;
  selectedBlock: BlockName | undefined;
};

const SelectedContent = ({
  selectedItems,
  setSelectedItems,
  selectedBlock,
}: Props) => {
  const navigate = useNavigate();

  const selectedBlocksContentLimit =
    blockMaster.find((e) => selectedBlock === e.name)?.maxContentItems || 1;

  const selectedItemsTotal = selectedItems?.length;

  return (
    <>
      {selectedItems && selectedItems.length > 0 && (
        <div className="py-6">
          <div className="pl-1 pb-3 text-brand-white">
            Selected Items{" "}
            {"( " +
              selectedItemsTotal +
              " / " +
              selectedBlocksContentLimit +
              " )"}
          </div>
          <div className="flex flex-col gap-3">
            {selectedItems &&
              selectedItems.length > 0 &&
              selectedItems?.map((data: ContentSelection, index) => {
                const { name, type, contentId } = data || {};

                return (
                  <React.Fragment key={"SelectedContent_" + name + index}>
                    <ContentCard
                      type={type}
                      name={name}
                      onNavigate={() => {
                        navigate(`${type}?contentId=${contentId}`);
                      }}
                      onDelete={() =>
                        setSelectedItems(
                          selectedItems.filter((_, i) => i !== index),
                        )
                      }
                    />
                  </React.Fragment>
                );
              })}
          </div>
        </div>
      )}
    </>
  );
};

export default SelectedContent;
