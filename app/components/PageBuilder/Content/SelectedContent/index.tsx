import { IoCloseCircle } from "react-icons/io5";
import { blockMaster } from "~/utility/blockMaster";
import { capitalizeFirst } from "~/helpers/stringHelpers";

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
        <div className="max-w-3xl overflow-x-auto">
          <div className="divider my-0 w-full py-0" />
          <div className="my-3 flex items-center gap-3 text-sm font-bold">
            <p>Selected Content</p>
            {"( " +
              selectedItemsTotal +
              " / " +
              selectedBlocksContentLimit +
              " )"}
          </div>
          <table className="table table-sm">
            <thead className="text-brand-white">
              <tr>
                <th className="w-1/4">#</th>
                <th className="w-1/4">Name</th>
                <th className="w-1/4">Type</th>
                <th className="w-1/4">Delete</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems?.map((data: ContentSelection, index) => {
                const { name, type } = data || {};

                return (
                  <tr
                    key={"selectedContent_" + name + index}
                    className="cursor-pointer"
                  >
                    <td className="w-1/4">{index + 1}</td>
                    <td className="w-1/4">{name && capitalizeFirst(name)}</td>
                    <td className="w-1/4">{type && capitalizeFirst(type)}</td>
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
              })}
            </tbody>
          </table>

          <div className="divider w-full" />
        </div>
      )}
    </>
  );
};

export default SelectedContent;
