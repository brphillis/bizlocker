import type { BlockName } from "~/utility/blockMaster/types";
import { blockMaster } from "~/utility/blockMaster/blockMaster";
import { capitalizeFirst } from "~/helpers/stringHelpers";
import SquareIconButton from "~/components/Buttons/SquareIconButton";

type Props = {
  selectedItems: ContentSelection[];
  setSelectedItems: Function;
  selectedBlock: BlockName | undefined;
};

const SelectedContent = ({
  selectedItems,
  setSelectedItems,
  selectedBlock,
}: Props) => {
  const selectedBlocksContentLimit =
    blockMaster.find((e) => selectedBlock === e.name)?.maxContentItems || 1;

  const selectedItemsTotal = selectedItems?.length;

  const shouldDisplay = () => {
    const blockTypes = ["banner", "tile", "map", "hero"];

    if (selectedBlock && blockTypes.includes(selectedBlock)) {
      return true;
    } else return false;
  };

  return (
    <>
      {selectedItems && selectedItems.length > 0 && shouldDisplay() && (
        <div className="py-6">
          <div className="ml-3 pb-3">
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
              shouldDisplay() &&
              selectedItems?.map((data: ContentSelection, index) => {
                const { name, type } = data || {};

                return (
                  <div
                    key={"selectedContent_" + name + index}
                    className="flex cursor-pointer items-center justify-between rounded-sm bg-brand-white/20 p-3 hover:scale-[1.005]"
                  >
                    <div>
                      {type && capitalizeFirst(type)}
                      {" / "}
                      {name && capitalizeFirst(name)}
                    </div>
                    <div className="flex items-center gap-3">
                      <SquareIconButton
                        iconName="IoSearch"
                        size="small"
                        color="primary"
                        onClickFunction={() =>
                          setSelectedItems(
                            selectedItems.filter((_, i) => i !== index)
                          )
                        }
                      />

                      <SquareIconButton
                        iconName="IoTrashBin"
                        size="small"
                        color="error"
                        onClickFunction={() =>
                          setSelectedItems(
                            selectedItems.filter((_, i) => i !== index)
                          )
                        }
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </>
  );
};

export default SelectedContent;
