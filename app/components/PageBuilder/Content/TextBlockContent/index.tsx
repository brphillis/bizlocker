import { useState } from "react";
import RichTextInput from "~/components/Forms/Input/RichTextInput/index.client";

type Props = {
  selectedBlock: BlockName | undefined;
  selectedItems: ContentSelection[];
  setSelectedItems: Function;
  defaultValue: TextBlockContent;
};

const TextBlockContent = ({
  selectedBlock,
  defaultValue,
  selectedItems,
  setSelectedItems,
}: Props) => {
  const [contentData] = useState<string>(defaultValue?.richText || "");

  const selectItem = (
    type: BlockContentType = "richText",
    contentId: string
  ) => {
    setSelectedItems((prevSelectedItems: any) => {
      if (!Array.isArray(prevSelectedItems)) {
        prevSelectedItems = [];
      }
      return [{ type, contentId }];
    });
  };

  if (!selectedItems) {
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
            className="mb-12 mt-3 h-[320px]"
          />
        </div>
      )}
    </>
  );
};

export default TextBlockContent;
