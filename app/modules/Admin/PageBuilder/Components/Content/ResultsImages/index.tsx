import type { Image } from "@prisma/client";
import { IoAdd, IoEllipsisVertical } from "react-icons/io5";
import BasicImage from "~/components/Client/BasicImage";
import type { BlockContentType } from "~/utility/blockMaster/types";

type Props = {
  selectedItems: PageBuilderContentSelection[];
  setSelectedItems: (items: PageBuilderContentSelection[]) => void;
  searchResults: Image[];
  contentType: BlockContentType | undefined;
};

const ResultsImages = ({
  selectedItems,
  setSelectedItems,
  searchResults,
  contentType,
}: Props) => {
  const shouldDisplay = (): boolean => {
    if (!searchResults) {
      return false;
    }

    let displayBool = true;

    searchResults.forEach((e) => {
      if (!("href" in e)) {
        displayBool = false;
      }
    });

    return displayBool;
  };

  const selectItems = (
    type: BlockContentType,
    contentId: number,
    name: string,
  ) => {
    const itemExists = selectedItems.some(
      (item) =>
        item.type === type &&
        item.contentId === contentId &&
        item.name === name,
    );

    if (!itemExists) {
      // @ts-expect-error: expected typeshift
      setSelectedItems((prevSelectedItems: PageBuilderContentSelection[]) => {
        if (!Array.isArray(prevSelectedItems)) {
          prevSelectedItems = [];
        }
        return [...prevSelectedItems, { type, contentId, name }];
      });
    }
  };

  return (
    <>
      {contentType === "image" && (
        <>
          {searchResults && contentType && shouldDisplay() && (
            <div className="mt-6 flex w-full flex-wrap justify-center gap-6 overflow-x-auto pb-3 max-lg:gap-3">
              {searchResults?.map(
                ({ id, href, altText }: Image, index: number) => {
                  return (
                    <div
                      key={id}
                      className="relative h-32 w-32 overflow-hidden transition-all duration-300 hover:scale-105"
                    >
                      {href && (
                        <BasicImage
                          src={href}
                          alt={altText || "image description placeholder"}
                          extendStyle="h-full w-full object-cover max-lg:h-44 max-lg:w-44"
                        />
                      )}

                      <button
                        type="button"
                        className="absolute bottom-3 right-3 flex h-6 w-6 cursor-pointer select-none items-center justify-center rounded-full bg-primary text-brand-white transition hover:bg-primary-dark"
                        onClick={() => {
                          const imageId = searchResults[index].id;
                          if (imageId) {
                            selectItems(contentType, imageId, altText || "");
                          }
                        }}
                      >
                        <IoAdd size={12} />
                      </button>

                      <button
                        type="button"
                        className="absolute bottom-3 left-3 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-primary text-brand-white transition hover:bg-primary-dark"
                      >
                        <IoEllipsisVertical size={12} />
                      </button>
                    </div>
                  );
                },
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ResultsImages;
