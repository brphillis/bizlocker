import { IoCaretForwardCircleSharp } from "react-icons/io5";
import { capitalizeFirst } from "~/helpers/stringHelpers";

type Props = {
  selectedBlock: BlockName | undefined;
  selectedItems: ContentSelection[];
  setSelectedItems: Function;
  searchResults: Campaign[] | Promotion[] | Product[] | Brand[];
  contentType: BlockContentType | undefined;
};

const BlockContentResultsTable = ({
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
      {searchResults &&
        (selectedBlock === "banner" ||
          selectedBlock === "tile" ||
          selectedBlock === "hero") &&
        (contentType === "campaign" ||
          contentType === "promotion" ||
          contentType === "brand" ||
          contentType === "product") && (
          <div className="w-full overflow-x-auto">
            <p className="my-3 text-sm font-bold">Select an Item</p>
            <table className="table table-sm">
              <thead className="text-brand-white">
                <tr>
                  <th className="w-1/4">#</th>
                  <th className="w-1/4">Name</th>
                  <th className="w-1/4">Created</th>
                  <th className="w-1/4">Go To</th>
                </tr>
              </thead>
              <tbody>
                {searchResults?.map(
                  (
                    { name, createdAt }: Promotion | Campaign | Product | Brand,
                    index: number
                  ) => {
                    return (
                      <tr
                        key={"tableContentResult_" + name + index}
                        className="cursor-pointer"
                        onClick={() => {
                          selectItems(
                            contentType,
                            searchResults[index].id,
                            name
                          );
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
    </>
  );
};

export default BlockContentResultsTable;
