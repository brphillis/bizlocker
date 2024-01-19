import type { BlockOptions } from "@prisma/client";
import type { BlockName } from "~/utility/blockMaster/types";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";
import {
  fontAlignSelectValues,
  fontSizeSelectValues,
  fontWeightSelectValues,
  mobileFontSizeSelectValues,
  mobilefontWeightSelectValues,
} from "../../Values/font";
import BlockInput from "../_FieldComponents/BlockInput";
import BlockColorInput from "../_FieldComponents/BlockColorInput";
import BlockSelectInput from "../_FieldComponents/BlockSelectInput";

type Props = {
  selectedBlock?: BlockName;
  defaultValues?: BlockOptions;
  selectedBlockOptions?: BlockMasterOptions;
};

const TitleOptions = ({
  selectedBlock,
  defaultValues,
  selectedBlockOptions,
}: Props) => {
  return (
    <details className="collapse collapse-plus !hidden !max-w-[100vw] max-md:!w-[100dvw] !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium text-brand-white">
        {selectedBlock === "text" ? "Heading" : "Title"}
      </summary>
      <div className="flex gap-3 flex-wrap items-start justify-start w-full px-3 pb-6 max-md:pb-3">
        <BlockInput
          valueName="Title"
          formName="title"
          blockMasterOption={selectedBlockOptions?.title}
          defaultValue={defaultValues?.title}
        />

        <BlockColorInput
          valueName="Title Color"
          formName="titleColor"
          blockMasterOption={selectedBlockOptions?.titleColor}
          defaultValue={defaultValues?.titleColor}
          type="text"
        />

        <BlockSelectInput
          valueName="Title Size"
          formName="titleSize"
          blockMasterOption={selectedBlockOptions?.titleSize}
          defaultValue={defaultValues?.titleSize}
          selections={fontSizeSelectValues}
        />

        <BlockSelectInput
          valueName="Title Size Mobile"
          formName="titleSizeMobile"
          blockMasterOption={selectedBlockOptions?.titleSizeMobile}
          defaultValue={defaultValues?.titleSizeMobile}
          selections={mobileFontSizeSelectValues}
        />

        <BlockSelectInput
          valueName="Title Weight"
          formName="titleFontWeight"
          blockMasterOption={selectedBlockOptions?.titleFontWeight}
          defaultValue={defaultValues?.titleFontWeight}
          selections={fontWeightSelectValues}
        />

        <BlockSelectInput
          valueName="Title Weight Mobile"
          formName="titleFontWeightMobile"
          blockMasterOption={selectedBlockOptions?.titleFontWeightMobile}
          defaultValue={defaultValues?.titleFontWeightMobile}
          selections={mobilefontWeightSelectValues}
        />

        <BlockSelectInput
          valueName="Title Align"
          formName="titleAlign"
          blockMasterOption={selectedBlockOptions?.titleAlign}
          defaultValue={defaultValues?.titleAlign}
          selections={fontAlignSelectValues}
        />
      </div>
    </details>
  );
};

export default TitleOptions;
