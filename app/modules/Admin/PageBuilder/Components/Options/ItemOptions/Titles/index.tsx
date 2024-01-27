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
  selectedItems: PageBuilderContentSelection[];
  defaultValues?: BlockOptions;
  selectedBlockOptions: BlockMasterOptions | undefined;
};

const Titles = ({
  selectedItems,
  defaultValues,
  selectedBlockOptions,
}: Props) => {
  return (
    <details className="collapse collapse-plus !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium text-brand-white">
        Titles
      </summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        <ItemInput
          title="Titles"
          formName="itemTitles"
          selectedItems={selectedItems}
          valueName="Title"
          blockMasterOption={selectedBlockOptions?.itemTitles}
          defaultValues={defaultValues?.itemTitles}
        />

        <ItemColorInput
          title="Colors"
          formName="itemTitleColors"
          selectedItems={selectedItems}
          valueName="Color"
          blockMasterOption={selectedBlockOptions?.itemTitleColors}
          defaultValues={defaultValues?.itemTitleColors}
          type="text"
        />

        <ItemSelectInput
          title="Sizes"
          formName="itemTitleSizes"
          selectedItems={selectedItems}
          valueName="Size"
          blockMasterOption={selectedBlockOptions?.itemTitleSizes}
          defaultValues={defaultValues?.itemTitleSizes}
          selections={fontSizeSelectValues}
        />

        <ItemSelectInput
          title="Sizes Mobile"
          formName="itemTitleSizesMobile"
          selectedItems={selectedItems}
          valueName="Size"
          blockMasterOption={selectedBlockOptions?.itemTitleSizesMobile}
          defaultValues={defaultValues?.itemTitleSizesMobile}
          selections={mobileFontSizeSelectValues}
        />

        <ItemSelectInput
          title="Weights"
          formName="itemTitleFontWeights"
          selectedItems={selectedItems}
          valueName="Weight"
          blockMasterOption={selectedBlockOptions?.itemTitleFontWeights}
          defaultValues={defaultValues?.itemTitleFontWeights}
          selections={fontWeightSelectValues}
        />

        <ItemSelectInput
          title="Weights Mobile"
          formName="itemTitleFontWeightsMobile"
          selectedItems={selectedItems}
          valueName="Weight"
          blockMasterOption={selectedBlockOptions?.itemTitleFontWeightsMobile}
          defaultValues={defaultValues?.itemTitleFontWeightsMobile}
          selections={mobilefontWeightSelectValues}
        />
      </div>
    </details>
  );
};

export default Titles;
