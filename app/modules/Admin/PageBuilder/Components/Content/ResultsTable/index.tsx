import type {
  Brand,
  Campaign,
  Product,
  Promotion,
  Store,
} from "@prisma/client";
import type { BlockContentType } from "~/utility/blockMaster/types";
import React from "react";
import ContentCard from "../SelectedContent/ContentCard";
import { useNavigate } from "@remix-run/react";

type Props = {
  setSelectedItems: (items: ContentSelection[]) => void;
  searchResults: Campaign[] | Promotion[] | Product[] | Brand[];
  contentType: BlockContentType | undefined;
  selectedItems: ContentSelection[];
};

const ResultsTable = ({
  setSelectedItems,
  searchResults,
  contentType,
  selectedItems,
}: Props) => {
  const navigate = useNavigate();

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
      setSelectedItems((prevSelectedItems: ContentSelection[]) => {
        if (!Array.isArray(prevSelectedItems)) {
          prevSelectedItems = [];
        }
        return [...prevSelectedItems, { type, contentId, name }];
      });
    }
  };

  const shouldDisplay = (): boolean => {
    if (!searchResults) {
      return false;
    }

    let displayBool = true;

    searchResults.forEach((e) => {
      if (!Object.prototype.hasOwnProperty.call(e, "href")) {
        displayBool = false;
      }
    });

    return displayBool;
  };

  return (
    <>
      {shouldDisplay() && (
        <div className="pt-6">
          <div className="pl-1 pb-3 text-brand-white">Results</div>

          {searchResults && searchResults.length === 0 && (
            <div className="ml-6 py-3 text-brand-white">No Results</div>
          )}

          <div className="flex flex-col gap-3">
            {contentType &&
              searchResults?.map(
                (
                  { id, name }: Promotion | Campaign | Product | Brand | Store,
                  index: number,
                ) => {
                  return (
                    <React.Fragment key={"ResultContent_" + name + index}>
                      <ContentCard
                        type={contentType}
                        name={name}
                        onNavigate={() => {
                          navigate(`${contentType}?contentId=${id}`, {});
                        }}
                        onAdd={() => {
                          selectItems(
                            contentType,
                            searchResults[index].id,
                            name,
                          );
                        }}
                      />
                    </React.Fragment>
                  );
                },
              )}
          </div>
        </div>
      )}
    </>
  );
};

export default ResultsTable;
