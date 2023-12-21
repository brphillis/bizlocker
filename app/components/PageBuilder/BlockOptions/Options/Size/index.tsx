import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";
import type { BlockName } from "~/utility/blockMaster/types";
import {
  getHeightSelectValues,
  getMobileHeightSelectValues,
  getMobileSizeSelectValues,
  getMobileWidthSelectValues,
  getSizeSelectValues,
  getWidthSelectValues,
} from "../../Values/size";
import BlockSelectInput from "../../Components/Blocks/BlockSelectInput";

type Props = {
  selectedBlock?: BlockName;
  defaultValues?: BlockOptions;
  selectedBlockOptions?: BlockMasterOptions;
};

const SizeOptions = ({
  selectedBlock,
  defaultValues,
  selectedBlockOptions,
}: Props) => {
  return (
    <details className="collapse collapse-plus !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">Size</summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        <BlockSelectInput
          valueName="Size"
          formName="size"
          blockMasterOption={selectedBlockOptions?.size}
          defaultValue={defaultValues?.size}
          selections={getSizeSelectValues(selectedBlock)}
        />

        <BlockSelectInput
          valueName="Size Mobile"
          formName="sizeMobile"
          blockMasterOption={selectedBlockOptions?.sizeMobile}
          defaultValue={defaultValues?.sizeMobile}
          selections={getMobileSizeSelectValues(selectedBlock)}
        />

        <BlockSelectInput
          valueName="Height"
          formName="height"
          blockMasterOption={selectedBlockOptions?.height}
          defaultValue={defaultValues?.height}
          selections={getHeightSelectValues(selectedBlock)}
        />

        <BlockSelectInput
          valueName="Height Mobile"
          formName="heightMobile"
          blockMasterOption={selectedBlockOptions?.heightMobile}
          defaultValue={defaultValues?.heightMobile}
          selections={getMobileHeightSelectValues(selectedBlock)}
        />

        <BlockSelectInput
          valueName="Width"
          formName="width"
          blockMasterOption={selectedBlockOptions?.width}
          defaultValue={defaultValues?.width}
          selections={getWidthSelectValues(selectedBlock)}
        />

        <BlockSelectInput
          valueName="Width Mobile"
          formName="widthMobile"
          blockMasterOption={selectedBlockOptions?.widthMobile}
          defaultValue={defaultValues?.widthMobile}
          selections={getMobileWidthSelectValues(selectedBlock)}
        />
      </div>
    </details>
  );
};

export default SizeOptions;
