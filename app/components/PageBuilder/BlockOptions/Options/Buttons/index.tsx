import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";
import BlockSelectInput from "../../Components/Blocks/BlockSelectInput";
import BlockInput from "../../Components/Blocks/BlockInput";
import { buttonStyleSelectValues } from "../../Values/buttons";
import BlockColorInput from "../../Components/Blocks/BlockColorInput";

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
          valueName="Primary Button"
          formName="primaryButton"
          blockMasterOption={selectedBlockOptions?.primaryButton}
          defaultValue={defaultValues?.primaryButton}
          selections={buttonStyleSelectValues}
        />

        <BlockColorInput
          valueName="Primary Button Color"
          formName="primaryButtonColor"
          blockMasterOption={selectedBlockOptions?.primaryButtonColor}
          defaultValue={defaultValues?.primaryButtonColor}
          type="bg"
        />

        <BlockColorInput
          valueName="Primary Button Border Color"
          formName="primaryButtonBorderColor"
          blockMasterOption={selectedBlockOptions?.primaryButtonBorderColor}
          defaultValue={defaultValues?.primaryButtonBorderColor}
          type="border"
        />

        <BlockInput
          valueName="Primary Button Label"
          formName="primaryButtonLabel"
          blockMasterOption={selectedBlockOptions?.primaryButtonLabel}
          defaultValue={defaultValues?.primaryButtonLabel}
        />

        <BlockColorInput
          valueName="Primary Button Label Color"
          formName="primaryButtonLabelColor"
          blockMasterOption={selectedBlockOptions?.primaryButtonLabelColor}
          defaultValue={defaultValues?.primaryButtonLabelColor}
          type="text"
        />

        <BlockInput
          valueName="Primary Button Link"
          formName="primaryButtonLink"
          blockMasterOption={selectedBlockOptions?.primaryButtonLink}
          defaultValue={defaultValues?.primaryButtonLink}
        />

        <BlockSelectInput
          valueName="Secondary Button"
          formName="secondaryButton"
          blockMasterOption={selectedBlockOptions?.secondaryButton}
          defaultValue={defaultValues?.secondaryButton}
          selections={buttonStyleSelectValues}
        />

        <BlockColorInput
          valueName="Secondary Button Color"
          formName="secondaryButtonColor"
          blockMasterOption={selectedBlockOptions?.secondaryButtonColor}
          defaultValue={defaultValues?.secondaryButtonColor}
          type="bg"
        />

        <BlockColorInput
          valueName="Secondary Button Border Color"
          formName="secondaryButtonBorderColor"
          blockMasterOption={selectedBlockOptions?.secondaryButtonBorderColor}
          defaultValue={defaultValues?.secondaryButtonBorderColor}
          type="border"
        />

        <BlockInput
          valueName="Secondary Button Label"
          formName="secondaryButtonLabel"
          blockMasterOption={selectedBlockOptions?.secondaryButtonLabel}
          defaultValue={defaultValues?.secondaryButtonLabel}
        />

        <BlockColorInput
          valueName="Secondary Button Label Color"
          formName="secondaryButtonLabelColor"
          blockMasterOption={selectedBlockOptions?.secondaryButtonLabelColor}
          defaultValue={defaultValues?.secondaryButtonLabelColor}
          type="text"
        />

        <BlockInput
          valueName="Secondary Button Link"
          formName="secondaryButtonLink"
          blockMasterOption={selectedBlockOptions?.secondaryButtonLink}
          defaultValue={defaultValues?.secondaryButtonLink}
        />
      </div>
    </details>
  );
};

export default ButtonOptions;
