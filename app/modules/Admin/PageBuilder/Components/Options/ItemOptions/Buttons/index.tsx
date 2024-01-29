import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/types";
import { buttonStyleSelectValues } from "../../Values/buttons";
import { flexAlignSelectValues } from "../../Values/basic";
import ItemSelectInput from "../_FieldComponents/ItemSelectInput";
import ItemInput from "../_FieldComponents/ItemInput";
import ItemColorInput from "../_FieldComponents/ItemColorInput";
import Divider from "~/components/Filter/ProductFilterSideBar/Divider";

type Props = {
  selectedItems: PageBuilderContentSelection[];
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
      <summary className="collapse-title text-xl font-medium text-brand-white">
        Buttons
      </summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        <ItemSelectInput
          title="Align"
          formName="itemButtonAlign"
          selectedItems={selectedItems}
          valueName="Align Buttons"
          blockMasterOption={selectedBlockOptions?.itemButtonAlign}
          defaultValues={defaultValues?.itemButtonAlign}
          selections={flexAlignSelectValues}
        />

        {Object.keys(selectedBlockOptions || {}).some(
          (key) => key.startsWith("itemButton") && key.endsWith("Primary"),
        ) && (
          <>
            <Divider color="white" />

            <div className="pl-1 text-sm font-medium text-brand-white">
              Primary Button
            </div>
          </>
        )}

        <ItemSelectInput
          title="Primary Style"
          formName="itemButtonsPrimary"
          selectedItems={selectedItems}
          valueName="Primary Button"
          blockMasterOption={selectedBlockOptions?.itemButtonsPrimary}
          defaultValues={defaultValues?.itemButtonsPrimary}
          selections={buttonStyleSelectValues}
        />

        <ItemInput
          title="Primary Labels"
          formName="itemButtonLabelsPrimary"
          selectedItems={selectedItems}
          valueName="Label"
          blockMasterOption={selectedBlockOptions?.itemButtonLabelsPrimary}
          defaultValues={defaultValues?.itemButtonLabelsPrimary}
        />

        <ItemColorInput
          title="Primary Label Colors"
          formName="itemButtonLabelColorsPrimary"
          selectedItems={selectedItems}
          valueName="Label Color"
          blockMasterOption={selectedBlockOptions?.itemButtonLabelColorsPrimary}
          defaultValues={defaultValues?.itemButtonLabelColorsPrimary}
          type="text"
        />

        <ItemColorInput
          title="Primary BG Colors"
          formName="itemButtonColorsPrimary"
          selectedItems={selectedItems}
          valueName="BG Color"
          blockMasterOption={selectedBlockOptions?.itemButtonColorsPrimary}
          defaultValues={defaultValues?.itemButtonColorsPrimary}
          type="bg"
        />

        <ItemColorInput
          title="Primary Border Colors"
          formName="itemButtonBorderColorsPrimary"
          selectedItems={selectedItems}
          valueName="Border Color"
          blockMasterOption={
            selectedBlockOptions?.itemButtonBorderColorsPrimary
          }
          defaultValues={defaultValues?.itemButtonBorderColorsPrimary}
          type="border"
        />

        <ItemInput
          title="Primary Links"
          formName="itemButtonLinksPrimary"
          selectedItems={selectedItems}
          valueName="Button Link"
          blockMasterOption={selectedBlockOptions?.itemButtonLinksPrimary}
          defaultValues={defaultValues?.itemButtonLinksPrimary}
        />

        {Object.keys(selectedBlockOptions || {}).some(
          (key) => key.startsWith("itemButton") && key.endsWith("Secondary"),
        ) && (
          <>
            <Divider color="white" />

            <div className="pl-1 text-sm font-medium text-brand-white">
              Secondary Button
            </div>
          </>
        )}

        <ItemSelectInput
          title="Secondary Style"
          formName="itemButtonsSecondary"
          selectedItems={selectedItems}
          valueName="Secondary Style"
          blockMasterOption={selectedBlockOptions?.itemButtonsSecondary}
          defaultValues={defaultValues?.itemButtonsSecondary}
          selections={buttonStyleSelectValues}
        />

        <ItemInput
          title="Secondary Labels"
          formName="itemButtonLabelsSecondary"
          selectedItems={selectedItems}
          valueName="Label"
          blockMasterOption={selectedBlockOptions?.itemButtonLabelsSecondary}
          defaultValues={defaultValues?.itemButtonLabelsSecondary}
        />

        <ItemColorInput
          title="Secondary Label Colors"
          formName="itemButtonLabelColorsSecondary"
          selectedItems={selectedItems}
          valueName="Label Color"
          blockMasterOption={
            selectedBlockOptions?.itemButtonLabelColorsSecondary
          }
          defaultValues={defaultValues?.itemButtonLabelColorsSecondary}
          type="text"
        />

        <ItemColorInput
          title="Secondary BG Colors"
          formName="itemButtonColorsSecondary"
          selectedItems={selectedItems}
          valueName="BG Color"
          blockMasterOption={selectedBlockOptions?.itemButtonColorsSecondary}
          defaultValues={defaultValues?.itemButtonColorsSecondary}
          type="bg"
        />

        <ItemColorInput
          title="Secondary Border Colors"
          formName="itemButtonBorderColorsSecondary"
          selectedItems={selectedItems}
          valueName="Border Color"
          blockMasterOption={
            selectedBlockOptions?.itemButtonBorderColorsSecondary
          }
          defaultValues={defaultValues?.itemButtonBorderColorsSecondary}
          type="border"
        />

        <ItemInput
          title="Secondary Links"
          formName="itemButtonLinksSecondary"
          selectedItems={selectedItems}
          valueName="Button Link"
          blockMasterOption={selectedBlockOptions?.itemButtonLinksSecondary}
          defaultValues={defaultValues?.itemButtonLinksSecondary}
        />
      </div>
    </details>
  );
};

export default Buttons;
