import { useState } from "react";
import {
  IoAdd,
  IoCloseCircle,
  IoEllipsisVertical,
  IoLink,
} from "react-icons/io5";
import SelectPageLinkPopupFormModule from "~/components/Forms/Modules/SelectPageLinkPopupFormModule";

type Props = {
  selectedBlock: BlockName | undefined;
  searchResults: Image[];
  contentType: BlockContentType | undefined;
};

const BlockContentImageResults = ({
  selectedBlock,
  searchResults,
  contentType,
}: Props) => {
  const [selectedItems, setSelectedItems] = useState<Image[]>([]);

  const [itemIndexToUpdate, setItemIndexToUpdate] = useState<
    number | undefined
  >(undefined);

  const selectItem = (item: Image) => {
    setSelectedItems(
      ((prevSelectedItems: Image[]) => [...prevSelectedItems, item])(
        selectedItems
      )
    );
  };

  const stringlifyIfArray = (items: Image[]) => {
    if (selectedItems.length === 1) {
      return items[0].id;
    } else {
      const itemsIdArray = items.map((item) => item.id);
      return JSON.stringify(itemsIdArray);
    }
  };

  return (
    <>
      <input
        name="image"
        value={
          selectedItems && selectedItems.length > 0
            ? stringlifyIfArray(selectedItems)
            : ""
        }
        hidden
        readOnly
      />

      {contentType === "image" && (
        <>
          {!isNaN(itemIndexToUpdate!) && (
            <SelectPageLinkPopupFormModule
              itemIndexToUpdate={itemIndexToUpdate}
              setItemIndexToUpdate={setItemIndexToUpdate}
              updateItemsFunction={setSelectedItems}
              items={selectedItems}
            />
          )}

          {searchResults &&
            (selectedBlock === "banner" ||
              selectedBlock === "tile" ||
              selectedBlock === "hero") && (
              <div className="flex w-full flex-wrap justify-center gap-6 overflow-x-auto pb-3 max-lg:gap-3">
                {searchResults?.map(
                  ({ id, url, altText }: Image, index: number) => {
                    return (
                      <div
                        key={id}
                        className="relative h-32 w-32 overflow-hidden transition-all duration-300 hover:scale-105"
                      >
                        <div
                          className="absolute bottom-3 right-3 flex h-6 w-6 cursor-pointer select-none items-center justify-center rounded-full bg-primary text-brand-white transition hover:bg-primary-focus"
                          onClick={() => selectItem(searchResults[index])}
                        >
                          <IoAdd size={12} />
                        </div>

                        <button className="absolute bottom-3 left-3 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-primary text-brand-white transition hover:bg-primary-focus">
                          <IoEllipsisVertical size={12} />
                        </button>
                        <img
                          src={url}
                          alt={altText}
                          className="h-full w-full object-cover max-lg:h-44 max-lg:w-44"
                        />
                      </div>
                    );
                  }
                )}
              </div>
            )}
        </>
      )}

      {selectedItems &&
        selectedItems?.length > 0 &&
        (selectedBlock === "banner" || selectedBlock === "tile") && (
          <div className="max-w-3xl overflow-x-auto">
            <p className="mb-3 text-sm font-bold">Selected Items</p>
            <table className="table table-sm">
              <thead className="text-brand-white">
                <tr>
                  <th className="w-1/4"></th>
                  <th className="w-1/4">Name</th>
                  <th className="w-1/4">Link</th>
                  <th className="w-1/4">Delete</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems?.map(({ url, altText }: Image, index) => {
                  return (
                    <tr key={"imageTile" + altText + index}>
                      <td className="w-1/4">{index + 1}</td>
                      <td className="w-1/4">{altText}</td>
                      <td className="w-1/4">
                        <div
                          className="ml-1 flex items-center gap-3"
                          onClick={() => {
                            setItemIndexToUpdate(index);
                          }}
                        >
                          <IoLink size={18} className="cursor-pointer" />
                          <span>{url}</span>
                        </div>
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
                          <IoCloseCircle size={18} className="cursor-pointer" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="divider w-full" />
          </div>
        )}
    </>
  );
};

export default BlockContentImageResults;
