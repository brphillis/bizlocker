import { useEffect, useState } from "react";
import { IoCaretForwardCircleSharp, IoCloseCircle } from "react-icons/io5";
import { capitalizeFirst } from "~/utility/stringHelpers";

type Props = {
  selectedBlock: BlockName | undefined;
  searchResults: Campaign[] | Promotion[] | Product[];
  contentType: BlockContentType | undefined;
};

const BlockContentResultsTable = ({
  selectedBlock,
  searchResults,
  contentType,
}: Props) => {
  const [selectedItems, setSelectedItems] = useState<
    (Campaign | Promotion | Product)[]
  >([]);

  const selectItem = (item: Campaign | Promotion | Product) => {
    setSelectedItems(
      ((prevSelectedItems: (Campaign | Promotion | Product)[]) => [
        ...prevSelectedItems,
        item,
      ])(selectedItems)
    );
  };

  const stringlifyIfArray = (items: (Campaign | Promotion | Product)[]) => {
    if (selectedItems?.length === 1) {
      return items[0].id;
    } else {
      const itemsIdArray = items.map((item) => item.id);
      return JSON.stringify(itemsIdArray);
    }
  };

  useEffect(() => {
    console.log(searchResults);
  }, [searchResults]);

  return (
    <>
      <input
        name={contentType}
        value={
          selectedItems && selectedItems.length > 0
            ? stringlifyIfArray(selectedItems)
            : ""
        }
        hidden
        readOnly
      />

      {searchResults &&
        (selectedBlock === "banner" ||
          selectedBlock === "tile" ||
          selectedBlock === "hero") &&
        (contentType === "campaign" ||
          contentType === "promotion" ||
          contentType === "product") && (
          <div className="w-full overflow-x-auto">
            <p className="my-3 text-sm font-bold">Select an Item</p>
            <table className="table table-sm">
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
                  (
                    { name, createdAt }: Promotion | Campaign | Product,
                    index: number
                  ) => {
                    return (
                      <tr
                        key={"tableContentResult_" + name + index}
                        onClick={() => {
                          selectItem(searchResults[index]);
                        }}
                      >
                        <td className="w-1/4">{index + 1}</td>
                        <td className="w-1/4">
                          {name && capitalizeFirst(name)}
                        </td>
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
        (selectedBlock === "banner" ||
          selectedBlock === "tile" ||
          selectedBlock === "hero") && (
          <div className="max-w-3xl overflow-x-auto">
            <div className="divider my-0 w-full py-0" />
            <p className="my-3 text-sm font-bold">Selected Content</p>
            <table className="table table-sm">
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
                  (
                    { name, createdAt }: Promotion | Campaign | Product,
                    index
                  ) => {
                    return (
                      <tr
                        key={"promotionOrCampaign_" + name + index}
                        className="cursor-pointer"
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

export default BlockContentResultsTable;
