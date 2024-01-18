import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/types";
import {
  fontSizeSelectValues,
  fontWeightSelectValues,
  mobileFontSizeSelectValues,
  mobilefontWeightSelectValues,
} from "../../Values/font";
import ItemInput from "../../FieldComponents/Items/ItemInput";
import ItemColorInput from "../../FieldComponents/Items/ItemColorInput";
import ItemSelectInput from "../../FieldComponents/Items/ItemSelectInput";

type Props = {
  selectedItems: ContentSelection[];
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
          title="Title Colors"
          formName="itemTitleColors"
          selectedItems={selectedItems}
          valueName="Title Color"
          blockMasterOption={selectedBlockOptions?.itemTitleColors}
          defaultValues={defaultValues?.itemTitleColors}
          type="text"
        />

        <ItemSelectInput
          title="Title Sizes"
          formName="itemTitleSizes"
          selectedItems={selectedItems}
          valueName="Title Size"
          blockMasterOption={selectedBlockOptions?.itemTitleSizes}
          defaultValues={defaultValues?.itemTitleSizes}
          selections={fontSizeSelectValues}
        />

        <ItemSelectInput
          title="Title Sizes Mobile"
          formName="itemTitleSizesMobile"
          selectedItems={selectedItems}
          valueName="Title Size"
          blockMasterOption={selectedBlockOptions?.itemTitleSizesMobile}
          defaultValues={defaultValues?.itemTitleSizesMobile}
          selections={mobileFontSizeSelectValues}
        />

        <ItemSelectInput
          title="Title Weights"
          formName="itemTitleFontWeights"
          selectedItems={selectedItems}
          valueName="Title Weight"
          blockMasterOption={selectedBlockOptions?.itemTitleFontWeights}
          defaultValues={defaultValues?.itemTitleFontWeights}
          selections={fontWeightSelectValues}
        />

        <ItemSelectInput
          title="Title Weights Mobile"
          formName="itemTitleFontWeightsMobile"
          selectedItems={selectedItems}
          valueName="Title Weight"
          blockMasterOption={selectedBlockOptions?.itemTitleFontWeightsMobile}
          defaultValues={defaultValues?.itemTitleFontWeightsMobile}
          selections={mobilefontWeightSelectValues}
        />
      </div>
    </details>
  );
};

export default Titles;
