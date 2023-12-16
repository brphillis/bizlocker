import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";
import BlockInput from "../../Components/Blocks/BlockInput";

type Props = {
  defaultValues?: BlockOptions;
  selectedBlockOptions?: BlockMasterOptions;
};

const CountOptions = ({ defaultValues, selectedBlockOptions }: Props) => {
  return (
    <details className="bg-brand-white/20 collapse collapse-plus !hidden !max-w-full !rounded-sm [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">Count</summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        <BlockInput
          valueName="Count"
          formName="count"
          blockMasterOption={selectedBlockOptions?.count}
          defaultValue={defaultValues?.count}
          type="number"
        />
      </div>
    </details>
  );
};

export default CountOptions;
