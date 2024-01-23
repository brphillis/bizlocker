import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";
import { yesNoSelectValues } from "../../Values/basic";
import BlockSelectInput from "../_FieldComponents/BlockSelectInput";
import BlockInput from "../_FieldComponents/BlockInput";

type Props = {
  defaultValues?: BlockOptions;
  selectedBlockOptions?: BlockMasterOptions;
};

const MotionOptions = ({ defaultValues, selectedBlockOptions }: Props) => {
  return (
    <details className="collapse collapse-plus !hidden !max-w-[100vw] max-md:!w-[100dvw] !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium text-brand-white">
        Motion
      </summary>
      <div className="flex gap-3 flex-wrap items-start justify-start w-full px-3 pb-6 max-md:pb-3">
        <BlockSelectInput
          valueName="Autoplay"
          formName="autoplay"
          blockMasterOption={selectedBlockOptions?.autoplay}
          defaultValue={defaultValues?.autoplay ? "true" : undefined}
          selections={yesNoSelectValues}
        />

        <BlockInput
          valueName="Speed"
          formName="speed"
          blockMasterOption={selectedBlockOptions?.speed}
          defaultValue={defaultValues?.speed}
          type="number"
        />
      </div>
    </details>
  );
};

export default MotionOptions;
