import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";

import {
  marginSelectValues,
  paddingSelectValues,
} from "../../Values/marginAndPadding";
import BlockSelectInput from "../../Components/BlockSelectInput";

type Props = {
  defaultValues?: BlockOptions;
  selectedBlockOptions?: BlockMasterOptions;
};

const MarginAndPaddingOptions = ({
  defaultValues,
  selectedBlockOptions,
}: Props) => {
  return (
    <details className="collapse !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">
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
