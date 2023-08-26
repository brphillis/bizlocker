import {
  IoAdd,
  IoCloseCircle,
  IoEllipsisVertical,
  IoLink,
} from "react-icons/io5";

type Props = {
  selectedBlock: BlockName | undefined;
  searchResults: Image[];
  selectedItems: ContentImage[];
  setSelectedItems: (prevSelectedItems: ContentImage[]) => void;
};

const BlockContentImageResults = ({
  selectedBlock,
  searchResults,
  selectedItems,
  setSelectedItems,
}: Props) => {
  const selectItem = (item: Image) => {
    const newContentImage: ContentImage = {
      image: item,
      href: "",
    };

    setSelectedItems(
      ((prevSelectedItems: ContentImage[]) => [
        ...prevSelectedItems,
        newContentImage,
      ])(selectedItems)
    );
  };

  const handleUpdateImageLink = () => {
    //HERE WE WILL SELECT A PAGE
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
          <div className="flex w-full flex-wrap justify-center gap-6 overflow-x-auto pb-3 max-lg:gap-3">
            {searchResults?.map(
              ({ id, url, altText }: Image, index: number) => {
                return (
                  <div
                    key={id}
                    className="relative h-32 w-32 transition-all duration-300 hover:scale-105"
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

      {selectedItems &&
        selectedItems.length > 0 &&
        (selectedBlock === "banner" || selectedBlock === "tile") && (
          <div className="max-w-3xl overflow-x-auto">
            <div className="divider my-0 w-full py-0" />
            <p className="my-3 text-sm font-bold">Selected Items</p>
            <table className="table table-sm">
              <thead className="text-brand-white">
                <tr>
                  <th className="w-1/5"></th>
                  <th className="w-1/5">Name</th>
                  <th className="w-1/5">Created</th>
                  <th className="w-1/5">Link</th>
                  <th className="w-1/5">Delete</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems?.map(({ image }: ContentImage, index) => {
                  return (
                    <tr key={"imageTile" + image?.altText + index}>
                      <td className="w-1/5">{index + 1}</td>
                      <td className="w-1/5">{image?.altText}</td>
                      <td className="w-1/5">
                        {new Date(image?.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td className="w-1/5">
                        <div className="ml-1">
                          <IoLink
                            size={18}
                            className="cursor-pointer"
                            onClick={() => handleUpdateImageLink()}
                          />
                        </div>
                      </td>
                      <td className="w-1/5">
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
