import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";
import BlockSelectInput from "../../Components/Blocks/BlockSelectInput";
import {
  alignSelectMobileValues,
  alignSelectValues,
  justifySelectMobileValues,
  justifySelectValues,
  objectPositionMobileSelectValues,
  objectPositionSelectValues,
} from "../../Values/position";

type Props = {
  defaultValues?: BlockOptions;
  selectedBlockOptions?: BlockMasterOptions;
};

const MotionOptions = ({ defaultValues, selectedBlockOptions }: Props) => {
  return (
    <details className="collapse collapse-plus !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">Position</summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
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

        <BlockSelectInput
          valueName="Image Focus"
          formName="imagePosition"
          blockMasterOption={selectedBlockOptions?.imagePosition}
          defaultValue={defaultValues?.imagePosition}
          selections={objectPositionSelectValues}
        />

        <BlockSelectInput
          valueName="Image Focus Mobile"
          formName="imagePositionMobile"
          blockMasterOption={selectedBlockOptions?.imagePositionMobile}
          defaultValue={defaultValues?.imagePositionMobile}
          selections={objectPositionMobileSelectValues}
        />
      </div>
    </details>
  );
};

export default MotionOptions;
