import { IoAdd, IoEllipsisVertical } from "react-icons/io5";

type Props = {
  selectedBlock: BlockName | undefined;
  selectedItems: ContentSelection[];
  setSelectedItems: Function;
  searchResults: Image[];
  contentType: BlockContentType | undefined;
};

const BlockContentImageResults = ({
  selectedItems,
  setSelectedItems,
  selectedBlock,
  searchResults,
  contentType,
}: Props) => {
  const selectItems = (
    type: BlockContentType,
    contentId: number,
    name: string
  ) => {
    setSelectedItems((prevSelectedItems: any) => {
      if (!Array.isArray(prevSelectedItems)) {
        prevSelectedItems = [];
      }
      return [...prevSelectedItems, { type, contentId, name }];
    });
  };

  return (
    <>
      {contentType === "image" && (
        <>
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
                          onClick={() => {
                            const imageId = searchResults[index].id;
                            if (imageId) {
                              selectItems(contentType, imageId, altText || "");
                            }
                          }}
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
    </>
  );
};

export default BlockContentImageResults;
