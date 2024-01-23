import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";
import { flipXSelectValues } from "../../Values/flipRotate";
import BlockSelectInput from "../_FieldComponents/BlockSelectInput";

type Props = {
  defaultValues?: BlockOptions;
  selectedBlockOptions?: BlockMasterOptions;
};

const FlipAndRotateOptions = ({
  defaultValues,
  selectedBlockOptions,
}: Props) => {
  return (
    <details className="collapse collapse-plus !hidden !max-w-[100vw] max-md:!w-[100dvw] !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium text-brand-white">
        Flip & Rotate
      </summary>
      <div className="flex gap-3 flex-wrap items-start justify-start w-full px-3 pb-6 max-md:pb-3">
        <BlockSelectInput
          valueName="Flip X"
          formName="flipX"
          blockMasterOption={selectedBlockOptions?.flipX}
          defaultValue={defaultValues?.flipX}
          selections={flipXSelectValues}
        />
      </div>
    </details>
  );
};

export default FlipAndRotateOptions;
