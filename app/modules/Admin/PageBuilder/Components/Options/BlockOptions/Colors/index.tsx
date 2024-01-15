import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";
import BlockColorInput from "../../FieldComponents/Blocks/BlockColorInput";

type Props = {
  defaultValues?: BlockOptions;
  selectedBlockOptions?: BlockMasterOptions;
};

const ColorOptions = ({ defaultValues, selectedBlockOptions }: Props) => {
  return (
    <details className="collapse collapse-plus !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium text-brand-white">
        Colors
      </summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        <BlockColorInput
          valueName="Primary Color"
          formName="colorPrimary"
          blockMasterOption={selectedBlockOptions?.colorPrimary}
          defaultValue={defaultValues?.colorPrimary}
        />

        <BlockColorInput
          valueName="Secondary Color"
          formName="colorSecondary"
          blockMasterOption={selectedBlockOptions?.colorSecondary}
          defaultValue={defaultValues?.colorSecondary}
        />
      </div>
    </details>
  );
};

export default ColorOptions;
