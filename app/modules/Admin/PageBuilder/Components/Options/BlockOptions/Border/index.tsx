import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";
import {
  borderDisplaySelectValues,
  borderRadiusSelectValues,
  borderSizeSelectValues,
} from "../../Values/borders";
import BlockSelectInput from "../_FieldComponents/BlockSelectInput";
import BlockColorInput from "../_FieldComponents/BlockColorInput";

type Props = {
  defaultValues?: BlockOptions;
  selectedBlockOptions?: BlockMasterOptions;
};

const BorderOptions = ({ defaultValues, selectedBlockOptions }: Props) => {
  return (
    <details className="collapse collapse-plus !hidden !max-w-[100vw] max-md:!w-[100dvw] !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium text-brand-white">
        Border
      </summary>

      <div className="flex gap-3 flex-wrap items-start justify-start w-full px-3 pb-6 max-md:pb-3">
        <BlockSelectInput
          valueName="Border Display"
          formName="borderDisplay"
          blockMasterOption={selectedBlockOptions?.borderDisplay}
          defaultValue={defaultValues?.borderDisplay}
          selections={borderDisplaySelectValues}
        />

        <BlockSelectInput
          valueName="Border Size"
          formName="borderSize"
          blockMasterOption={selectedBlockOptions?.borderSize}
          defaultValue={defaultValues?.borderSize}
          selections={borderSizeSelectValues}
        />

        <BlockColorInput
          valueName="Border Color"
          formName="borderColor"
          blockMasterOption={selectedBlockOptions?.borderColor}
          defaultValue={defaultValues?.borderColor}
          type="border"
        />

        <BlockSelectInput
          valueName="Border Radius"
          formName="borderRadius"
          blockMasterOption={selectedBlockOptions?.borderRadius}
          defaultValue={defaultValues?.borderRadius}
          selections={borderRadiusSelectValues}
          tooltip="Using Shaped Radius Disables Border Colors"
        />
      </div>
    </details>
  );
};

export default BorderOptions;
