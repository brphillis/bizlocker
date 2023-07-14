import { useState } from "react";
import RichTextEditor from "~/components/RichTextEditor.client";

type Props = {
  selectedBlock: BlockName | undefined;
  defaultValue: string[];
};

const TextBlockOptions = ({ selectedBlock, defaultValue }: Props) => {
  const [stringData, setStringData] = useState<string>(defaultValue?.[0] || "");

  return (
    <>
      {selectedBlock === "text" && (
        <div className="w-full overflow-x-auto">
          <div className="divider my-0 w-full py-0" />
          <RichTextEditor
            value={stringData}
            onChange={setStringData}
            className="mb-12 mt-6 h-[320px]"
          />

          <input name="stringData" value={stringData} hidden readOnly />
        </div>
      )}
    </>
  );
};

export default TextBlockOptions;
