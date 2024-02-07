import React from "react";
import { BlockName } from "~/utility/blockMaster/types";
import { blockMaster } from "~/utility/blockMaster/blockMaster";
import ContentCard from "./ContentCard";
import { useNavigate } from "@remix-run/react";
import { swapContentArrayElements } from "~/helpers/arrayHelpers";
import { BlockOptions } from "@prisma/client";
import { BlockWithContent } from "~/models/Blocks/types";

type Props = {
  currentBlocks: BlockWithContent[] | null;
  editingIndex: number;
  selectedItems: PageBuilderContentSelection[];
  setCurrentBlocks: React.Dispatch<
    React.SetStateAction<BlockWithContent[] | null>
  >;
  setSelectedItems: React.Dispatch<
    React.SetStateAction<PageBuilderContentSelection[]>
  >;
  selectedBlock: BlockName | undefined;
  currentBlockOptions?: BlockOptions;
};

const SelectedContent = ({
  currentBlocks,
  editingIndex,
  selectedItems,
  setCurrentBlocks,
  setSelectedItems,
  selectedBlock,
}: Props) => {
  const navigate = useNavigate();

  const selectedBlocksContentLimit =
    blockMaster.find((e) => selectedBlock === e.name)?.maxContentItems || 1;

  const selectedItemsTotal = selectedItems?.length;

  const moveToEndAtIndex = (arr: string[], indexToMove: number): string[] => {
    if (indexToMove < 0 || indexToMove >= arr.length) {
      // Index out of bounds, return the original array
      return arr;
    }

    const newArr: string[] = [
      ...arr.slice(0, indexToMove),
      ...arr.slice(indexToMove + 1),
      arr[indexToMove],
    ];

    return newArr;
  };

  const handleMoveItem = (index: number, direction: "up" | "down") => {
    const blocks = currentBlocks;

    const currentEditingOptions =
      currentBlocks?.[editingIndex]?.blockOptions?.[0];

    if (currentBlocks && currentEditingOptions) {
      for (const optionKey in currentEditingOptions) {
        let optionValue =
          currentEditingOptions[optionKey as keyof BlockOptions];

        if (Array.isArray(optionValue)) {
          optionValue = swapContentArrayElements(
            optionValue as string[],
            direction === "up" ? index - 1 : index + 1,
            index,
          ) as string[];

          const keyToEdit =
            blocks?.[editingIndex]?.blockOptions?.[0]?.[
              optionKey as keyof BlockOptions
            ];

          if (keyToEdit) {
            (blocks![editingIndex]!.blockOptions![0]![
              optionKey as keyof BlockOptions
            ] as string[]) = optionValue;
          }
        }
      }
    }

    setCurrentBlocks(blocks);

    const swappedItemsArray = swapContentArrayElements(
      selectedItems,
      direction === "up" ? index - 1 : index + 1,
      index,
    );

    if (swappedItemsArray) {
      setSelectedItems(swappedItemsArray as PageBuilderContentSelection[]);
    }
  };

  const handleDeleteItem = (index: number) => {
    const blocks = currentBlocks;

    const currentEditingOptions =
      currentBlocks?.[editingIndex]?.blockOptions?.[0];

    if (currentBlocks && currentEditingOptions) {
      for (const optionKey in currentEditingOptions) {
        if (
          Array.isArray(
            blocks?.[editingIndex]?.blockOptions?.[0]?.[
              optionKey as keyof BlockOptions
            ],
          )
        ) {
          (blocks![editingIndex]!.blockOptions![0]![
            optionKey as keyof BlockOptions
          ] as string[]) = moveToEndAtIndex(
            blocks![editingIndex]!.blockOptions![0]![
              optionKey as keyof BlockOptions
            ] as string[],
            index,
          );
        }
      }
    }

    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

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
              selectedItems?.map((data: PageBuilderContentSelection, index) => {
                const { name, type, contentId } = data || {};

                return (
                  <React.Fragment key={"SelectedContent_" + name + index}>
                    <ContentCard
                      type={type}
                      name={name}
                      onNavigate={() => {
                        navigate(`${type}?contentId=${contentId}`);
                      }}
                      onDelete={() => handleDeleteItem(index)}
                      onChangeOrderUp={
                        index > 0
                          ? () => handleMoveItem(index, "up")
                          : undefined
                      }
                      onChangeOrderDown={
                        index < selectedItems.length - 1
                          ? () => handleMoveItem(index, "down")
                          : undefined
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
