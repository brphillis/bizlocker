import { useState } from "react";
import { BlockContentWithDetails } from "~/models/Blocks/types";
import { BlockContentType, BlockName } from "~/utility/blockMaster/types";
import RichTextInput from "~/components/Forms/Input/RichTextInput/index.client";

type Props = {
  selectedBlock: BlockName | undefined;
  selectedItems: ContentSelection[];
  setSelectedItems: (items: ContentSelection[]) => void;
  defaultValue: BlockContentWithDetails;
};

const TextBlockContentModule = ({
  selectedBlock,
  defaultValue,
  selectedItems,
  setSelectedItems,
}: Props) => {
  const [contentData] = useState<string>(defaultValue?.richText || "");

  const selectItem = (
    type: BlockContentType = "richText",
    contentId: string,
  ) => {
    // @ts-expect-error: expected typeshift
    setSelectedItems((prevSelectedItems: ContentSelection[]) => {
      if (!Array.isArray(prevSelectedItems)) {
        prevSelectedItems = [];
      }
      return [{ type, contentId }];
    });
  };

  if (!selectedItems && defaultValue?.richText) {
    selectItem("richText", defaultValue?.richText);
  }

  return (
    <>
      {selectedBlock === "text" && (
        <div className="w-full overflow-x-auto">
          <RichTextInput
            value={contentData}
            onChange={(selectedValue) => {
              selectItem("richText", selectedValue);
            }}
            extendStyle="mb-[42px] h-[320px]"
          />
        </div>
      )}
    </>
  );
};

export default TextBlockContentModule;
