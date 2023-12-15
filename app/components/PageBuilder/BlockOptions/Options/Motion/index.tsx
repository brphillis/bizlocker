import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";
import { yesNoSelectValues } from "../../Values/basic";
import BlockSelectInput from "../../Components/BlockSelectInput";
import BlockInput from "../../Components/BlockInput";

type Props = {
  defaultValues?: BlockOptions;
  selectedBlockOptions?: BlockMasterOptions;
};

const MotionOptions = ({ defaultValues, selectedBlockOptions }: Props) => {
  return (
    <details className="collapse collapse-plus !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">Count</summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        <BlockSelectInput
          valueName="Autoplay"
          formName="autoplay"
          blockMasterOption={selectedBlockOptions?.autoplay}
          defaultValue={defaultValues?.autoplay}
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
