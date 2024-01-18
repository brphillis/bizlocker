import { useState } from "react";
import type { BlockContentWithDetails } from "~/models/blocks.server";
import RichTextInput from "~/components/Forms/Input/RichTextInput/index.client";
import type { BlockName, BlockContentType } from "~/utility/blockMaster/types";

type Props = {
  selectedBlock: BlockName | undefined;
  selectedItems: ContentSelection[];
  setSelectedItems: Function;
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
    setSelectedItems((prevSelectedItems: any) => {
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
