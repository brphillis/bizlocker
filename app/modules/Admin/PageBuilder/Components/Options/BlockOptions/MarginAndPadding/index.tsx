import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";

import {
  marginSelectValues,
  paddingSelectValues,
} from "../../Values/marginAndPadding";
import BlockSelectInput from "../_FieldComponents/BlockSelectInput";

type Props = {
  defaultValues?: BlockOptions;
  selectedBlockOptions?: BlockMasterOptions;
};

const MarginAndPaddingOptions = ({
  defaultValues,
  selectedBlockOptions,
}: Props) => {
  return (
    <details className="collapse collapse-plus !hidden !max-w-[100vw] max-md:!w-[100dvw] !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium text-brand-white">
        Margin & Padding
      </summary>
      <div className="flex gap-3 flex-wrap items-start justify-start w-full px-3 pb-6 max-md:pb-3">
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
