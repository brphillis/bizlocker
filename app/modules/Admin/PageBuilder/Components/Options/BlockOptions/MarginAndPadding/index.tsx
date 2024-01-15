import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";

import {
  marginSelectValues,
  paddingSelectValues,
} from "../../Values/marginAndPadding";
import BlockSelectInput from "../../FieldComponents/Blocks/BlockSelectInput";

type Props = {
  defaultValues?: BlockOptions;
  selectedBlockOptions?: BlockMasterOptions;
};

const MarginAndPaddingOptions = ({
  defaultValues,
  selectedBlockOptions,
}: Props) => {
  return (
    <details className="bg-brand-white/20 collapse collapse-plus !hidden !max-w-full !rounded-sm [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium text-brand-white">
        Margin & Padding
      </summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        <BlockSelectInput
          valueName="Margin"
          formName="margin"
          blockMasterOption={selectedBlockOptions?.margin}
          defaultValue={defaultValues?.margin}
          selections={marginSelectValues}
        />

        <BlockSelectInput
          valueName="Padding"
          formName="padding"
          blockMasterOption={selectedBlockOptions?.padding}
          defaultValue={defaultValues?.padding}
          selections={paddingSelectValues}
        />
      </div>
    </details>
  );
};

export default MarginAndPaddingOptions;
