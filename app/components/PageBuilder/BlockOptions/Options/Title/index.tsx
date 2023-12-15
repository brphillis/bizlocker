import type { BlockOptions } from "@prisma/client";
import type { BlockName } from "~/utility/blockMaster/types";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";
import BlockInput from "../../Components/BlockInput";
import BlockSelectInput from "../../Components/BlockSelectInput";
import {
  fontAlignSelectValues,
  fontSizeSelectValues,
  fontWeightSelectValues,
} from "../../Values/font";
import { textColorSelection } from "../../Values/colors";

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

        <BlockSelectInput
          valueName="Title Size"
          formName="titleSize"
          blockMasterOption={selectedBlockOptions?.titleSize}
          defaultValue={defaultValues?.titleSize}
          selections={fontSizeSelectValues}
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

        <BlockSelectInput
          valueName="Title Color"
          formName="titleColor"
          blockMasterOption={selectedBlockOptions?.titleColor}
          defaultValue={defaultValues?.titleColor}
          selections={textColorSelection}
        />
      </div>
    </details>
  );
};

export default TitleOptions;
