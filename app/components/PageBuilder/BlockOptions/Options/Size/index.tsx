import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";
import type { BlockName } from "~/utility/blockMaster/types";
import { basicSizeSelectValues } from "../../Values/size";
import BlockSelectInput from "../../Components/BlockSelectInput";

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
    <details className="collapse !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">Size</summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        <BlockSelectInput
          valueName="Size"
          formName="size"
          blockMasterOption={selectedBlockOptions?.size}
          defaultValue={defaultValues?.size}
          selections={basicSizeSelectValues}
        />

        <BlockSelectInput
          valueName="Size Mobile"
          formName="sizeMobile"
          blockMasterOption={selectedBlockOptions?.sizeMobile}
          defaultValue={defaultValues?.sizeMobile}
          selections={basicSizeSelectValues}
        />
      </div>
    </details>
  );
};

export default SizeOptions;
