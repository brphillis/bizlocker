import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";
import BlockSelectInput from "../_FieldComponents/BlockSelectInput";
import {
  alignSelectMobileValues,
  alignSelectValues,
  justifySelectMobileValues,
  justifySelectValues,
} from "../../Values/position";

type Props = {
  defaultValues?: BlockOptions;
  selectedBlockOptions?: BlockMasterOptions;
};

const AlignmentOptions = ({ defaultValues, selectedBlockOptions }: Props) => {
  return (
    <details className="collapse collapse-plus !hidden !max-w-[100vw] max-md:!w-[100dvw] !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium text-brand-white">
        Alignment
      </summary>
      <div className="flex gap-3 flex-wrap items-start justify-start w-full px-3 pb-6 max-md:pb-3">
        <BlockSelectInput
          valueName="Justify"
          formName="justify"
          blockMasterOption={selectedBlockOptions?.justify}
          defaultValue={defaultValues?.justify}
          selections={justifySelectValues}
        />

        <BlockSelectInput
          valueName="Justify Mobile"
          formName="justifyMobile"
          blockMasterOption={selectedBlockOptions?.justifyMobile}
          defaultValue={defaultValues?.justifyMobile}
          selections={justifySelectMobileValues}
        />

        <BlockSelectInput
          valueName="Align"
          formName="align"
          blockMasterOption={selectedBlockOptions?.align}
          defaultValue={defaultValues?.align}
          selections={alignSelectValues}
        />

        <BlockSelectInput
          valueName="Align Mobile"
          formName="alignMobile"
          blockMasterOption={selectedBlockOptions?.alignMobile}
          defaultValue={defaultValues?.alignMobile}
          selections={alignSelectMobileValues}
        />
      </div>
    </details>
  );
};

export default AlignmentOptions;
