import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/types";
import ItemSelectInput from "../../Components/Items/ItemSelectInput";
import ItemColorInput from "../../Components/Items/ItemColorInput";
import { buttonStyleSelectValues } from "../../Values/buttons";
import ItemInput from "../../Components/Items/ItemInput";

type Props = {
  selectedItems: ContentSelection[];
  defaultValues?: BlockOptions;
  selectedBlockOptions: BlockMasterOptions | undefined;
};

const Buttons = ({
  selectedItems,
  defaultValues,
  selectedBlockOptions,
}: Props) => {
  return (
    <details className="collapse collapse-plus !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">Buttons</summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        <ItemSelectInput
          title="Primary Buttons"
          formName="itemPrimaryButtons"
          selectedItems={selectedItems}
          valueName="Primary Button"
          blockMasterOption={selectedBlockOptions?.itemPrimaryButtons}
          defaultValues={defaultValues?.itemPrimaryButtons}
          selections={buttonStyleSelectValues}
        />

        <ItemInput
          title="Primary Button Labels"
          formName="itemPrimaryButtonLabels"
          selectedItems={selectedItems}
          valueName="Label"
          blockMasterOption={selectedBlockOptions?.itemPrimaryButtonLabels}
          defaultValues={defaultValues?.itemPrimaryButtonLabels}
        />

        <ItemColorInput
          title="Primary Button Label Colors"
          formName="itemPrimaryButtonLabelColors"
          selectedItems={selectedItems}
          valueName="Label Color"
          blockMasterOption={selectedBlockOptions?.itemPrimaryButtonLabelColors}
          defaultValues={defaultValues?.itemPrimaryButtonLabelColors}
          type="text"
        />

        <ItemColorInput
          title="Primary Button BG Colors"
          formName="itemPrimaryButtonColors"
          selectedItems={selectedItems}
          valueName="BG Color"
          blockMasterOption={selectedBlockOptions?.itemPrimaryButtonColors}
          defaultValues={defaultValues?.itemPrimaryButtonColors}
          type="bg"
        />

        <ItemColorInput
          title="Primary Button Border Colors"
          formName="itemPrimaryButtonBorderColors"
          selectedItems={selectedItems}
          valueName="Border Color"
          blockMasterOption={
            selectedBlockOptions?.itemPrimaryButtonBorderColors
          }
          defaultValues={defaultValues?.itemPrimaryButtonBorderColors}
          type="border"
        />

        <ItemInput
          title="Primary Button Links"
          formName="itemPrimaryButtonLinks"
          selectedItems={selectedItems}
          valueName="Button Link"
          blockMasterOption={selectedBlockOptions?.itemPrimaryButtonLinks}
          defaultValues={defaultValues?.itemPrimaryButtonLinks}
        />

        <ItemSelectInput
          title="Secondary Buttons"
          formName="itemSecondaryButtons"
          selectedItems={selectedItems}
          valueName="Secondary Button"
          blockMasterOption={selectedBlockOptions?.itemSecondaryButtons}
          defaultValues={defaultValues?.itemSecondaryButtons}
          selections={buttonStyleSelectValues}
        />

        <ItemInput
          title="Secondary Button Labels"
          formName="itemSecondaryButtonLabels"
          selectedItems={selectedItems}
          valueName="Label"
          blockMasterOption={selectedBlockOptions?.itemSecondaryButtonLabels}
          defaultValues={defaultValues?.itemSecondaryButtonLabels}
        />

        <ItemColorInput
          title="Secondary Button Label Colors"
          formName="itemSecondaryButtonLabelColors"
          selectedItems={selectedItems}
          valueName="Label Color"
          blockMasterOption={
            selectedBlockOptions?.itemSecondaryButtonLabelColors
          }
          defaultValues={defaultValues?.itemSecondaryButtonLabelColors}
          type="text"
        />

        <ItemColorInput
          title="Secondary Button BG Colors"
          formName="itemSecondaryButtonColors"
          selectedItems={selectedItems}
          valueName="BG Color"
          blockMasterOption={selectedBlockOptions?.itemSecondaryButtonColors}
          defaultValues={defaultValues?.itemSecondaryButtonColors}
          type="bg"
        />

        <ItemColorInput
          title="Secondary Button Border Colors"
          formName="itemSecondaryButtonBorderColors"
          selectedItems={selectedItems}
          valueName="Border Color"
          blockMasterOption={
            selectedBlockOptions?.itemSecondaryButtonBorderColors
          }
          defaultValues={defaultValues?.itemSecondaryButtonBorderColors}
          type="border"
        />

        <ItemInput
          title="Secondary Button Links"
          formName="itemSecondaryButtonLinks"
          selectedItems={selectedItems}
          valueName="Button Link"
          blockMasterOption={selectedBlockOptions?.itemSecondaryButtonLinks}
          defaultValues={defaultValues?.itemSecondaryButtonLinks}
        />
      </div>
    </details>
  );
};

export default Buttons;
