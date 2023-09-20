import { useState } from "react";
import RichTextInput from "~/components/Forms/Input/RichTextInput/index.client";

type Props = {
  selectedBlock: BlockName | undefined;
  defaultValue: string[];
};

const TextBlockOptions = ({ selectedBlock, defaultValue }: Props) => {
  const [contentData, setContentData] = useState<string>(
    defaultValue?.[0] || ""
  );
  console.log("CONT", contentData);
  return (
    <>
      {selectedBlock === "text" && (
        <div className="w-full overflow-x-auto">
          <RichTextInput
            value={contentData}
            onChange={setContentData}
            className="mb-12 mt-3 h-[320px]"
          />

          <input name="richText" value={contentData} hidden readOnly />
        </div>
      )}
    </>
  );
};

export default TextBlockOptions;
