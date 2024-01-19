import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";
import BlockColorInput from "../_FieldComponents/BlockColorInput";

type Props = {
  defaultValues?: BlockOptions;
  selectedBlockOptions?: BlockMasterOptions;
};

const ColorOptions = ({ defaultValues, selectedBlockOptions }: Props) => {
  return (
    <details className="collapse collapse-plus !hidden !max-w-[100vw] max-md:!w-[100dvw] !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium text-brand-white">
        Colors
      </summary>
      <div className="flex gap-3 flex-wrap items-start justify-start w-full px-3 pb-6 max-md:pb-3">
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
