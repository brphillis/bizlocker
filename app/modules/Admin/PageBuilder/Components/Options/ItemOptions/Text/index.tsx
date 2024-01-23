import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/types";
import {
  fontSizeSelectValues,
  fontWeightSelectValues,
  mobileFontSizeSelectValues,
  mobilefontWeightSelectValues,
} from "../../Values/font";
import ItemInput from "../_FieldComponents/ItemInput";
import ItemColorInput from "../_FieldComponents/ItemColorInput";
import ItemSelectInput from "../_FieldComponents/ItemSelectInput";

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
      <summary className="collapse-title text-xl font-medium text-brand-white">
        Text
      </summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        <ItemInput
          title="Text"
          formName="itemShortText"
          selectedItems={selectedItems}
          valueName="Short Text"
          blockMasterOption={selectedBlockOptions?.itemShortText}
          defaultValues={defaultValues?.itemShortText}
        />

        <ItemColorInput
          title="Colors"
          formName="itemShortTextColors"
          selectedItems={selectedItems}
          valueName="Color"
          blockMasterOption={selectedBlockOptions?.itemShortTextColors}
          defaultValues={defaultValues?.itemShortTextColors}
          type="text"
        />

        <ItemSelectInput
          title="Sizes"
          formName="itemShortTextSizes"
          selectedItems={selectedItems}
          valueName="Size"
          blockMasterOption={selectedBlockOptions?.itemShortTextSizes}
          defaultValues={defaultValues?.itemShortTextSizes}
          selections={fontSizeSelectValues}
        />

        <ItemSelectInput
          title="Sizes Mobile"
          formName="itemShortTextSizesMobile"
          selectedItems={selectedItems}
          valueName="Size Mobile"
          blockMasterOption={selectedBlockOptions?.itemShortTextSizesMobile}
          defaultValues={defaultValues?.itemShortTextSizesMobile}
          selections={mobileFontSizeSelectValues}
        />

        <ItemSelectInput
          title="Weights"
          formName="itemShortTextFontWeights"
          selectedItems={selectedItems}
          valueName="Weight"
          blockMasterOption={selectedBlockOptions?.itemShortTextFontWeights}
          defaultValues={defaultValues?.itemShortTextFontWeights}
          selections={fontWeightSelectValues}
        />

        <ItemSelectInput
          title="Weights Mobile"
          formName="itemShortTextFontWeightsMobile"
          selectedItems={selectedItems}
          valueName="Weight"
          blockMasterOption={
            selectedBlockOptions?.itemShortTextFontWeightsMobile
          }
          defaultValues={defaultValues?.itemShortTextFontWeightsMobile}
          selections={mobilefontWeightSelectValues}
        />
      </div>
    </details>
  );
};

export default Text;
