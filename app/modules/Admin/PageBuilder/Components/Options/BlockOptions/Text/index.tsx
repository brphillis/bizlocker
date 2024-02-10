import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";
import BlockInput from "../_FieldComponents/BlockInput";
import BlockColorInput from "../_FieldComponents/BlockColorInput";
import {
  fontSizeSelectValues,
  fontWeightSelectValues,
  mobileFontSizeSelectValues,
  mobilefontWeightSelectValues,
} from "../../Values/font";
import BlockSelectInput from "../_FieldComponents/BlockSelectInput";

type Props = {
  defaultValues?: BlockOptions;
  selectedBlockOptions?: BlockMasterOptions;
};

const TextOptions = ({ defaultValues, selectedBlockOptions }: Props) => {
  return (
    <details className="collapse collapse-plus !hidden !max-w-[100vw] max-md:!w-[100dvw] !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium text-brand-white">
        Text
      </summary>
      <div className="flex gap-3 flex-wrap items-start justify-start w-full px-3 pb-6 max-md:pb-3">
        <BlockInput
          valueName="Text"
          formName="shortText"
          blockMasterOption={selectedBlockOptions?.shortText}
          defaultValue={defaultValues?.shortText}
        />

        <BlockColorInput
          valueName="Text Color"
          formName="shortTextColor"
          blockMasterOption={selectedBlockOptions?.shortTextColor}
          defaultValue={defaultValues?.shortTextColor}
          type="text"
        />

        <BlockSelectInput
          valueName="Text Size"
          formName="shortTextSize"
          blockMasterOption={selectedBlockOptions?.shortTextSize}
          defaultValue={defaultValues?.shortTextSize}
          selections={fontSizeSelectValues}
        />

        <BlockSelectInput
          valueName="Text Size Mobile"
          formName="shortTextSizeMobile"
          blockMasterOption={selectedBlockOptions?.shortTextSizeMobile}
          defaultValue={defaultValues?.shortTextSizeMobile}
          selections={mobileFontSizeSelectValues}
        />

        <BlockSelectInput
          valueName="Text Weight"
          formName="shortTextFontWeight"
          blockMasterOption={selectedBlockOptions?.shortTextFontWeight}
          defaultValue={defaultValues?.shortTextFontWeight}
          selections={fontWeightSelectValues}
        />

        <BlockSelectInput
          valueName="Text Weight Mobile"
          formName="shortTextFontWeightMobile"
          blockMasterOption={selectedBlockOptions?.shortTextFontWeightMobile}
          defaultValue={defaultValues?.shortTextFontWeightMobile}
          selections={mobilefontWeightSelectValues}
        />
      </div>
    </details>
  );
};

export default TextOptions;
