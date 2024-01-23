import { useState } from "react";
import Icon from "~/components/Icon";
import { BlockName } from "~/utility/blockMaster/types";
import { BlockWithContent } from "~/models/Blocks/types";
import { capitalizeFirst } from "~/helpers/stringHelpers";
import BasicInput from "~/components/Forms/Input/BasicInput";

type Props = {
  currentBlocks: BlockWithContent[] | null;
  selectedBlock: BlockName | undefined;
  editingIndex: number;
};

const LabelEdit = ({ currentBlocks, selectedBlock, editingIndex }: Props) => {
  const [blockLabel, setBlockLabel] = useState<string | undefined>(
    currentBlocks?.[editingIndex]?.label || selectedBlock,
  );
  const [editingBlockLabel, setEditingBlockLabel] = useState<boolean>(false);

  return (
    <div className="w-full flex justify-center">
      {editingBlockLabel && (
        <div className="flex gap-1 items-start py-1">
          <BasicInput
            id="19285539129_BlockLabelChangeInput"
            name="blockLabel"
            type="text"
            placeholder="Label"
            labelStyle="text-brand-white"
            extendContainerStyle="pl-3 w-[215px] pb-3"
            extendStyle="!max-h-[32px] !min-h-[32px] !text-sm"
          />

          <button
            type="button"
            className="bg-primary h-[32px] w-[32px] p-[6px] !rounded-sm cursor-pointer"
            onClick={() => {
              const updatedLabelValue = (
                document?.getElementById(
                  "19285539129_BlockLabelChangeInput",
                ) as HTMLInputElement
              )?.value;

              if (updatedLabelValue) {
                setBlockLabel(updatedLabelValue);
              }

              setEditingBlockLabel(false);
            }}
          >
            <Icon
              iconName="IoCheckmark"
              size={8}
              color="#FFFFFFBF"
              extendStyle="h-full w-full"
            />
          </button>
        </div>
      )}

      {!editingBlockLabel && (
        <div className="relative flex gap-3 items-center pb-3 pl-1">
          <div className="text-brand-white text-sm select-none">
            {blockLabel
              ? capitalizeFirst(blockLabel)
              : selectedBlock && capitalizeFirst(selectedBlock)}
          </div>
          <button
            type="button"
            className="absolute right-[-24px] cursor-pointer"
            onClick={() => setEditingBlockLabel(true)}
          >
            <Icon iconName="IoPencil" size={12} color="#FFFFFFBF" />
          </button>
        </div>
      )}
      <input readOnly hidden name="blockLabel" value={blockLabel} />
    </div>
  );
};

export default LabelEdit;
