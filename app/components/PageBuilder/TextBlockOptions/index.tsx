import { useState } from "react";
import RichTextInput from "~/components/Forms/Input/RichTextInput/index.client";

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
          <RichTextInput
            value={stringData}
            onChange={setStringData}
            className="mb-12 mt-3 h-[320px]"
          />

          <input name="stringData" value={stringData} hidden readOnly />
        </div>
      )}
    </>
  );
};

export default TextBlockOptions;
