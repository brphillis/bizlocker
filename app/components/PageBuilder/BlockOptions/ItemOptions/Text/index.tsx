import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/types";
import ItemSelectInput from "../../Components/Items/ItemSelectInput";
import ItemColorInput from "../../Components/Items/ItemColorInput";
import ItemInput from "../../Components/Items/ItemInput";
import {
  fontSizeSelectValues,
  mobileFontSizeSelectValues,
} from "../../Values/font";

type Props = {
  selectedItems: ContentSelection[];
  defaultValues?: BlockOptions;
  selectedBlockOptions: BlockMasterOptions | undefined;
};

const Text = ({
  selectedItems,
  defaultValues,
  selectedBlockOptions,
}: Props) => {
  return (
    <details className="collapse collapse-plus !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">Text</summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        <ItemInput
          title="Short Text"
          formName="itemShortText"
          selectedItems={selectedItems}
          valueName="Short Text"
          blockMasterOption={selectedBlockOptions?.itemShortText}
          defaultValues={defaultValues?.itemShortText}
        />

        <ItemColorInput
          title="Short Text Colors"
          formName="itemShortTextColors"
          selectedItems={selectedItems}
          valueName="Short Text Color"
          blockMasterOption={selectedBlockOptions?.itemShortTextColors}
          defaultValues={defaultValues?.itemShortTextColors}
          type="text"
        />

        <ItemSelectInput
          title="Short Text Sizes"
          formName="itemShortTextSizes"
          selectedItems={selectedItems}
          valueName="Short Text Size"
          blockMasterOption={selectedBlockOptions?.itemShortTextSizes}
          defaultValues={defaultValues?.itemShortTextSizes}
          selections={fontSizeSelectValues}
        />

        <ItemSelectInput
          title="Short Text Sizes Mobile"
          formName="itemShortTextSizesMobile"
          selectedItems={selectedItems}
          valueName="Short Text Size Mobile"
          blockMasterOption={selectedBlockOptions?.itemShortTextSizesMobile}
          defaultValues={defaultValues?.itemShortTextSizesMobile}
          selections={mobileFontSizeSelectValues}
        />
      </div>
    </details>
  );
};

export default Text;
