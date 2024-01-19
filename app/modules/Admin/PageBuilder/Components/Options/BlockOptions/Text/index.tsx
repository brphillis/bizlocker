import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";
import type { BlockName } from "~/utility/blockMaster/types";
import BlockInput from "../_FieldComponents/BlockInput";
import BlockColorInput from "../_FieldComponents/BlockColorInput";

type Props = {
  colors: string[];
  selectedBlock?: BlockName;
  defaultValues?: BlockOptions;
  selectedBlockOptions?: BlockMasterOptions;
};

const TextOptions = ({
  selectedBlock,
  defaultValues,
  selectedBlockOptions,
}: Props) => {
  return (
    <details className="collapse collapse-plus !hidden !max-w-[100vw] max-md:!w-[100dvw] !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium text-brand-white">
        Text
      </summary>
      <div className="flex gap-3 flex-wrap items-start justify-start w-full px-3 pb-6 max-md:pb-3">
        <BlockInput
          valueName="Text"
          formName="shortText"
          blockMasterOption={selectedBlockOptions?.shortText}
          defaultValue={defaultValues?.shortText}
        />

        <BlockColorInput
          valueName="Text Color"
          formName="shortTextColor"
          blockMasterOption={selectedBlockOptions?.shortTextColor}
          defaultValue={defaultValues?.shortTextColor}
          type="text"
        />
      </div>
    </details>
  );
};

export default TextOptions;
