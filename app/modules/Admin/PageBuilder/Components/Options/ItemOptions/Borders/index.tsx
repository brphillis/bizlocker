import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/types";
import {
  borderDisplaySelectValues,
  borderRadiusSelectValues,
  borderSizeSelectValues,
} from "../../Values/borders";
import ItemSelectInput from "../_FieldComponents/ItemSelectInput";
import ItemColorInput from "../_FieldComponents/ItemColorInput";

type Props = {
  selectedItems: ContentSelection[];
  defaultValues?: BlockOptions;
  selectedBlockOptions: BlockMasterOptions | undefined;
};

const Borders = ({
  selectedItems,
  defaultValues,
  selectedBlockOptions,
}: Props) => {
  return (
    <details className="collapse collapse-plus !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium text-brand-white">
        Borders
      </summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        <ItemSelectInput
          title="Displays"
          formName="itemBorderDisplays"
          selectedItems={selectedItems}
          valueName="Display"
          blockMasterOption={selectedBlockOptions?.itemBorderDisplays}
          defaultValues={defaultValues?.itemBorderDisplays}
          selections={borderDisplaySelectValues}
        />

        <ItemColorInput
          title="Colors"
          formName="itemBorderColors"
          selectedItems={selectedItems}
          valueName="Color"
          blockMasterOption={selectedBlockOptions?.itemBorderColors}
          defaultValues={defaultValues?.itemBorderColors}
          type="border"
        />

        <ItemSelectInput
          title="Radius"
          formName="itemBorderRadius"
          selectedItems={selectedItems}
          valueName="Radius"
          blockMasterOption={selectedBlockOptions?.itemBorderRadius}
          defaultValues={defaultValues?.itemBorderRadius}
          selections={borderRadiusSelectValues}
        />

        <ItemSelectInput
          title="Sizes"
          formName="itemBorderSizes"
          selectedItems={selectedItems}
          valueName="Radius"
          blockMasterOption={selectedBlockOptions?.itemBorderSizes}
          defaultValues={defaultValues?.itemBorderSizes}
          selections={borderSizeSelectValues}
        />
      </div>
    </details>
  );
};

export default Borders;
