import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";
import { buttonStyleSelectValues } from "../../Values/buttons";
import { flexAlignSelectValues } from "../../Values/basic";
import BlockSelectInput from "../../FieldComponents/Blocks/BlockSelectInput";
import BlockColorInput from "../../FieldComponents/Blocks/BlockColorInput";
import BlockInput from "../../FieldComponents/Blocks/BlockInput";

type Props = {
  defaultValues?: BlockOptions;
  selectedBlockOptions?: BlockMasterOptions;
};

const ButtonOptions = ({ defaultValues, selectedBlockOptions }: Props) => {
  return (
    <details className="collapse collapse-plus !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">Buttons</summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        <BlockSelectInput
          valueName="Button Align"
          formName="buttonAlign"
          blockMasterOption={selectedBlockOptions?.buttonAlign}
          defaultValue={defaultValues?.buttonAlign}
          selections={flexAlignSelectValues}
        />

        <BlockSelectInput
          valueName="Primary Button"
          formName="buttonPrimary"
          blockMasterOption={selectedBlockOptions?.buttonPrimary}
          defaultValue={defaultValues?.buttonPrimary}
          selections={buttonStyleSelectValues}
        />

        <BlockColorInput
          valueName="Primary Button Color"
          formName="buttonColorPrimary"
          blockMasterOption={selectedBlockOptions?.buttonColorPrimary}
          defaultValue={defaultValues?.buttonColorPrimary}
          type="bg"
        />

        <BlockColorInput
          valueName="Primary Button Border Color"
          formName="buttonBorderColorPrimary"
          blockMasterOption={selectedBlockOptions?.buttonBorderColorPrimary}
          defaultValue={defaultValues?.buttonBorderColorPrimary}
          type="border"
        />

        <BlockInput
          valueName="Primary Button Label"
          formName="buttonLabelPrimary"
          blockMasterOption={selectedBlockOptions?.buttonLabelPrimary}
          defaultValue={defaultValues?.buttonLabelPrimary}
        />

        <BlockColorInput
          valueName="Primary Button Label Color"
          formName="buttonLabelColorPrimary"
          blockMasterOption={selectedBlockOptions?.buttonLabelColorPrimary}
          defaultValue={defaultValues?.buttonLabelColorPrimary}
          type="text"
        />

        <BlockInput
          valueName="Primary Button Link"
          formName="buttonLinkPrimary"
          blockMasterOption={selectedBlockOptions?.buttonLinkPrimary}
          defaultValue={defaultValues?.buttonLinkPrimary}
        />

        <BlockSelectInput
          valueName="Secondary Button"
          formName="buttonSecondary"
          blockMasterOption={selectedBlockOptions?.buttonSecondary}
          defaultValue={defaultValues?.buttonSecondary}
          selections={buttonStyleSelectValues}
        />

        <BlockColorInput
          valueName="Secondary Button Color"
          formName="buttonColorSecondary"
          blockMasterOption={selectedBlockOptions?.buttonColorSecondary}
          defaultValue={defaultValues?.buttonColorSecondary}
          type="bg"
        />

        <BlockColorInput
          valueName="Secondary Button Border Color"
          formName="buttonBorderColorSecondary"
          blockMasterOption={selectedBlockOptions?.buttonBorderColorSecondary}
          defaultValue={defaultValues?.buttonBorderColorSecondary}
          type="border"
        />

        <BlockInput
          valueName="Secondary Button Label"
          formName="buttonLabelSecondary"
          blockMasterOption={selectedBlockOptions?.buttonLabelSecondary}
          defaultValue={defaultValues?.buttonLabelSecondary}
        />

        <BlockColorInput
          valueName="Secondary Button Label Color"
          formName="buttonLabelColorSecondary"
          blockMasterOption={selectedBlockOptions?.buttonLabelColorSecondary}
          defaultValue={defaultValues?.buttonLabelColorSecondary}
          type="text"
        />

        <BlockInput
          valueName="Secondary Button Link"
          formName="buttonLinkSecondary"
          blockMasterOption={selectedBlockOptions?.buttonLinkSecondary}
          defaultValue={defaultValues?.buttonLinkSecondary}
        />
      </div>
    </details>
  );
};

export default ButtonOptions;
