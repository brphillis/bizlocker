import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/types";
import ItemColorInput from "../_FieldComponents/ItemColorInput";

type Props = {
  selectedItems: PageBuilderContentSelection[];
  defaultValues?: BlockOptions;
  selectedBlockOptions: BlockMasterOptions | undefined;
};

const Colors = ({
  selectedItems,
  defaultValues,
  selectedBlockOptions,
}: Props) => {
  return (
    <details className="collapse collapse-plus !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium text-brand-white">
        Colors
      </summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        <ItemColorInput
          title="Primary Colors"
          formName="itemColors"
          selectedItems={selectedItems}
          valueName="Color"
          blockMasterOption={selectedBlockOptions?.itemColors}
          defaultValues={defaultValues?.itemColors}
        />
        <ItemColorInput
          title="Secondary Colors"
          formName="itemColorsSecondary"
          selectedItems={selectedItems}
          valueName="Secondary Color"
          blockMasterOption={selectedBlockOptions?.itemColorsSecondary}
          defaultValues={defaultValues?.itemColorsSecondary}
        />
      </div>
    </details>
  );
};

export default Colors;
