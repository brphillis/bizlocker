import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";
import type { BlockName } from "~/utility/blockMaster/types";
import { textColorSelection } from "../../Values/colors";
import BlockSelectInput from "../../Components/BlockSelectInput";
import BlockInput from "../../Components/BlockInput";

type Props = {
  colors: string[];
  selectedBlock?: BlockName;
  defaultValues?: BlockOptions;
  selectedBlockOptions?: BlockMasterOptions;
};

const ShortTextOptions = ({
  selectedBlock,
  defaultValues,
  selectedBlockOptions,
}: Props) => {
  return (
    <details className="collapse !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">
        {selectedBlock === "text" ? "Text" : "Short Text"}
      </summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        <BlockSelectInput
          valueName="Short Text Color"
          formName="shortTextColor"
          blockMasterOption={selectedBlockOptions?.shortTextColor}
          defaultValue={defaultValues?.shortTextColor}
          selections={textColorSelection}
        />

        <BlockInput
          valueName="Short Text"
          formName="shortText"
          blockMasterOption={selectedBlockOptions?.shortText}
          defaultValue={defaultValues?.shortText}
        />
      </div>
    </details>
  );
};

export default ShortTextOptions;
