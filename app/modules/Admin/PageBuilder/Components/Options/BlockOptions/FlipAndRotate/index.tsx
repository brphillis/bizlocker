import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";
import { flipXSelectValues } from "../../Values/flipRotate";
import BlockSelectInput from "../../FieldComponents/Blocks/BlockSelectInput";

type Props = {
  defaultValues?: BlockOptions;
  selectedBlockOptions?: BlockMasterOptions;
};

const FlipAndRotateOptions = ({
  defaultValues,
  selectedBlockOptions,
}: Props) => {
  return (
    <details className="bg-brand-white/20 collapse collapse-plus !hidden !max-w-full !rounded-sm [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">
        Flip & Rotate
      </summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
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
