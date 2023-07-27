import { useSearchParams } from "@remix-run/react";

import { IoCaretForwardCircleSharp, IoCloseCircle } from "react-icons/io5";
import { capitalizeFirst } from "~/utility/stringHelpers";

type Props = {
  selectedBlock: BlockName | undefined;
  searchResults: Campaign[] | Promotion[];
  selectedItems: (Campaign | Promotion)[];
  setSelectedItems: (prevSelectedItems: (Campaign | Promotion)[]) => void;
};

const BlockContentResults = ({
  selectedBlock,
  searchResults,
  selectedItems,
  setSelectedItems,
}: Props) => {
  const [searchParams] = useSearchParams();

  const selectItem = (item: Campaign | Promotion) => {
    const blockName = searchParams.get("blockName");

    if (blockName === "banner" && selectedItems.length >= 1) {
      // BANNER BLOCK CAN ONLY HAVE 1 ITEM
      return;
    }

    if (blockName === "tile" && selectedItems.length >= 4) {
      // TILE BLOCK CAN HAVE MAX OF 4 ITEMS
      return;
    }

    setSelectedItems(
      ((prevSelectedItems: (Campaign | Promotion)[]) => [
        ...prevSelectedItems,
        item,
      ])(selectedItems)
    );
  };

  return (
    <>
      <input
        name="contentData"
        value={selectedItems && JSON.stringify(selectedItems)}
        hidden
        readOnly
      />

      {searchResults &&
        (selectedBlock === "banner" || selectedBlock === "tile") && (
          <div className="w-full overflow-x-auto">
            <p className="my-3 text-sm font-bold">Select an Item</p>
            <table className="table-sm table">
              <thead>
                <tr>
                  <th className="w-1/4"></th>
                  <th className="w-1/4">Name</th>
                  <th className="w-1/4">Created</th>
                  <th className="w-1/4">Go To</th>
                </tr>
              </thead>
              <tbody>
                {searchResults?.map(
                  ({ name, createdAt }: Promotion | Campaign, index) => {
                    return (
                      <tr
                        key={"promotionOrCampaign_" + name + index}
                        className="hover cursor-pointer"
                        onClick={() => {
                          selectItem(searchResults[index]);
                        }}
                      >
                        <td className="w-1/4">{index + 1}</td>
                        <td className="w-1/4">{capitalizeFirst(name)}</td>
                        <td className="w-1/4">
                          {new Date(createdAt).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </td>
                        <td className="w-1/4">
                          <div className="ml-2">
                            <IoCaretForwardCircleSharp size={18} />
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}

      {selectedItems &&
        selectedItems.length > 0 &&
        (selectedBlock === "banner" || selectedBlock === "tile") && (
          <div className="max-w-3xl overflow-x-auto">
            <div className="divider my-0 w-full py-0" />
            <p className="my-3 text-sm font-bold">Selected Items</p>
            <table className="table-sm table">
              <thead>
                <tr>
                  <th className="w-1/4"></th>
                  <th className="w-1/4">Name</th>
                  <th className="w-1/4">Created</th>
                  <th className="w-1/4">Delete</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems?.map(
                  ({ name, createdAt }: Promotion | Campaign, index) => {
                    return (
                      <tr
                        key={"promotionOrCampaign_" + name + index}
                        className="hover cursor-pointer"
                      >
                        <td className="w-1/4">{index + 1}</td>
                        <td className="w-1/4">{name}</td>
                        <td className="w-1/4">
                          {new Date(createdAt).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </td>
                        <td className="w-1/4">
                          <div
                            className="ml-2"
                            onClick={() =>
                              setSelectedItems(
                                selectedItems.filter((_, i) => i !== index)
                              )
                            }
                          >
                            <IoCloseCircle size={18} />
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>

            <div className="divider w-full" />
          </div>
        )}
    </>
  );
};

export default BlockContentResults;
