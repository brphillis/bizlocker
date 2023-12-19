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

const Titles = ({
  selectedItems,
  defaultValues,
  selectedBlockOptions,
}: Props) => {
  return (
    <details className="collapse collapse-plus !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">Titles</summary>
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
          valueName="Title Size Mobile"
          blockMasterOption={selectedBlockOptions?.itemTitleSizesMobile}
          defaultValues={defaultValues?.itemTitleSizesMobile}
          selections={mobileFontSizeSelectValues}
        />
      </div>
    </details>
  );
};

export default Titles;
