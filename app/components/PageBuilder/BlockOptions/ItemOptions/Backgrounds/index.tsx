import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/types";
import ItemColorInput from "../../Components/Items/ItemColorInput";

type Props = {
  selectedItems: ContentSelection[];
  defaultValues?: BlockOptions;
  selectedBlockOptions: BlockMasterOptions | undefined;
};

const Backgrounds = ({
  selectedItems,
  defaultValues,
  selectedBlockOptions,
}: Props) => {
  return (
    <details className="collapse collapse-plus !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">
        Backgrounds
      </summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        <ItemColorInput
          title="Background Colors"
          formName="itemBackgroundColors"
          selectedItems={selectedItems}
          valueName="Color"
          blockMasterOption={selectedBlockOptions?.itemBackgroundColors}
          defaultValues={defaultValues?.itemBackgroundColors}
          type="bg"
        />

        <ItemColorInput
          title="Secondary Background Colors"
          formName="itemSecondaryBackgroundColors"
          selectedItems={selectedItems}
          valueName="Color"
          blockMasterOption={
            selectedBlockOptions?.itemSecondaryBackgroundColors
          }
          defaultValues={defaultValues?.itemSecondaryBackgroundColors}
          type="bg"
        />
      </div>
    </details>
  );
};

export default Backgrounds;
