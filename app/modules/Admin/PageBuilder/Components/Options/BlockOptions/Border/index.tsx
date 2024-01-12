import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";
import {
  borderDisplaySelectValues,
  borderRadiusSelectValues,
  borderSizeSelectValues,
} from "../../Values/borders";
import BlockSelectInput from "../../FieldComponents/Blocks/BlockSelectInput";
import BlockColorInput from "../../FieldComponents/Blocks/BlockColorInput";

type Props = {
  defaultValues?: BlockOptions;
  selectedBlockOptions?: BlockMasterOptions;
};

const BorderOptions = ({ defaultValues, selectedBlockOptions }: Props) => {
  return (
    <details className="collapse collapse-plus !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">Border</summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
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
