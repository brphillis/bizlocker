import type {
  Brand,
  Campaign,
  Product,
  Promotion,
  Store,
} from "@prisma/client";
import type { BlockContentType, BlockName } from "~/utility/blockMaster/types";
import { capitalizeFirst } from "~/helpers/stringHelpers";
import SquareIconButton from "~/components/Buttons/SquareIconButton";

type Props = {
  selectedBlock: BlockName | undefined;
  setSelectedItems: Function;
  searchResults: Campaign[] | Promotion[] | Product[] | Brand[];
  contentType: BlockContentType | undefined;
  selectedItems: ContentSelection[];
};

const ResultsTable = ({
  setSelectedItems,
  selectedBlock,
  searchResults,
  contentType,
  selectedItems,
}: Props) => {
  const selectItems = (
    type: BlockContentType,
    contentId: number,
    name: string
  ) => {
    const itemExists = selectedItems.some(
      (item) =>
        item.type === type && item.contentId === contentId && item.name === name
    );

    if (!itemExists) {
      setSelectedItems((prevSelectedItems: any) => {
        if (!Array.isArray(prevSelectedItems)) {
          prevSelectedItems = [];
        }
        return [...prevSelectedItems, { type, contentId, name }];
      });
    }
  };

  const shouldDisplay = () => {
    const blockTypes = ["banner", "tile", "map", "hero"];
    const contentTypes = [
      "promotion",
      "campaign",
      "product",
      "icon",
      "store",
      "brand",
    ];

    if (
      contentType &&
      selectedBlock &&
      contentTypes.includes(contentType) &&
      blockTypes.includes(selectedBlock)
    ) {
      return true;
    } else return false;
  };

  return (
    <>
      {searchResults &&
        selectedItems &&
        selectedItems.length > 0 &&
        shouldDisplay() && (
          <div className="py-6">
            <div className="ml-3 pb-3">Results</div>

            {searchResults && searchResults.length === 0 && (
              <div className="ml-6 pt-6">No Results</div>
            )}

            <div className="flex flex-col gap-3">
              {contentType &&
                searchResults?.map(
                  (
                    { name }: Promotion | Campaign | Product | Brand | Store,
                    index: number
                  ) => {
                    return (
                      <div
                        key={"selectedContent_" + name + index}
                        className="flex cursor-pointer items-center justify-between rounded-sm bg-brand-white/20 p-3 hover:scale-[1.005]"
                        onClick={() => {
                          selectItems(
                            contentType,
                            searchResults[index].id,
                            name
                          );
                        }}
                      >
                        <div>{name && capitalizeFirst(name)}</div>
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
                            iconName="IoAdd"
                            size="small"
                            color="primary"
                            onClickFunction={() => {
                              selectItems(
                                contentType,
                                searchResults[index].id,
                                name
                              );
                            }}
                          />
                        </div>
                      </div>
                    );
                  }
                )}
            </div>
          </div>
        )}
    </>
  );
};

export default ResultsTable;
