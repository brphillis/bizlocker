import type { BlockOptions } from "@prisma/client";
import type { BlockName } from "~/utility/blockMaster/types";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";
import BlockInput from "../../Components/Blocks/BlockInput";
import BlockSelectInput from "../../Components/Blocks/BlockSelectInput";
import {
  fontAlignSelectValues,
  fontSizeSelectValues,
  fontWeightSelectValues,
  mobileFontSizeSelectValues,
} from "../../Values/font";
import BlockColorInput from "../../Components/Blocks/BlockColorInput";

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
    <details className="collapse collapse-plus !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">
        {selectedBlock === "text" ? "Heading" : "Title"}
      </summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
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
          formName="titleWeight"
          blockMasterOption={selectedBlockOptions?.titleWeight}
          defaultValue={defaultValues?.titleWeight}
          selections={fontWeightSelectValues}
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
