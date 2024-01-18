import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/types";
import { backgroundPatternSelectValues } from "../../Values/background";
import { blockWidthSelectValues } from "../../Values/width";
import { containerDisplaySelectValues } from "../../Values/basic";
import ItemSelectInput from "../../FieldComponents/Items/ItemSelectInput";
import ItemColorInput from "../../FieldComponents/Items/ItemColorInput";
import ItemInput from "../../FieldComponents/Items/ItemInput";

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
      <summary className="collapse-title text-xl font-medium text-brand-white">
        Backgrounds
      </summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        <ItemSelectInput
          title="Primary Background Display"
          formName="itemBackgroundDisplaysPrimary"
          selectedItems={selectedItems}
          valueName="BG Display"
          blockMasterOption={
            selectedBlockOptions?.itemBackgroundDisplaysPrimary
          }
          defaultValues={defaultValues?.itemBackgroundDisplaysPrimary}
          selections={containerDisplaySelectValues}
        />

        <ItemColorInput
          title="Primary Background Colors"
          formName="itemBackgroundColorsPrimary"
          selectedItems={selectedItems}
          valueName="Color"
          blockMasterOption={selectedBlockOptions?.itemBackgroundColorsPrimary}
          defaultValues={defaultValues?.itemBackgroundColorsPrimary}
          type="bg"
        />

        <ItemSelectInput
          title="Primary Background Width"
          formName="itemBackgroundWidthsPrimary"
          selectedItems={selectedItems}
          valueName="BG Width"
          blockMasterOption={selectedBlockOptions?.itemBackgroundWidthsPrimary}
          defaultValues={defaultValues?.itemBackgroundWidthsPrimary}
          selections={blockWidthSelectValues}
        />

        <ItemInput
          title="Primary Background Brightness"
          formName="itemBackgroundBrightnessesPrimary"
          selectedItems={selectedItems}
          valueName="BG Brightness"
          type="number"
          blockMasterOption={
            selectedBlockOptions?.itemBackgroundBrightnessesPrimary
          }
          defaultValues={defaultValues?.itemBackgroundBrightnessesPrimary}
        />

        <ItemSelectInput
          title="Primary Background Pattern"
          formName="itemBackgroundPatternNamesPrimary"
          selectedItems={selectedItems}
          valueName="BG Pattern"
          blockMasterOption={
            selectedBlockOptions?.itemBackgroundPatternNamesPrimary
          }
          defaultValues={defaultValues?.itemBackgroundPatternNamesPrimary}
          selections={backgroundPatternSelectValues}
        />

        <ItemColorInput
          title="Primary Background Pattern Color"
          formName="itemBackgroundPatternColorsPrimary"
          selectedItems={selectedItems}
          valueName="BG Pattern Color"
          blockMasterOption={
            selectedBlockOptions?.itemBackgroundPatternColorsPrimary
          }
          defaultValues={defaultValues?.itemBackgroundPatternColorsPrimary}
          type="bg"
        />

        <ItemInput
          title="Primary Background Pattern Opacity"
          formName="itemBackgroundPatternOpacitiesPrimary"
          selectedItems={selectedItems}
          valueName="BG Pattern Opacity"
          type="number"
          blockMasterOption={
            selectedBlockOptions?.itemBackgroundPatternOpacitiesPrimary
          }
          defaultValues={defaultValues?.itemBackgroundPatternOpacitiesPrimary}
        />

        <ItemInput
          title="Primary Background Pattern Size"
          formName="itemBackgroundPatternSizesPrimary"
          selectedItems={selectedItems}
          valueName="BG Pattern Size"
          type="number"
          blockMasterOption={
            selectedBlockOptions?.itemBackgroundPatternSizesPrimary
          }
          defaultValues={defaultValues?.itemBackgroundPatternSizesPrimary}
        />

        <ItemSelectInput
          title="Secondary Background Display"
          formName="itemBackgroundDisplaysSecondary"
          selectedItems={selectedItems}
          valueName="BG Display"
          blockMasterOption={
            selectedBlockOptions?.itemBackgroundDisplaysSecondary
          }
          defaultValues={defaultValues?.itemBackgroundDisplaysSecondary}
          selections={containerDisplaySelectValues}
        />

        <ItemColorInput
          title="Secondary Background Colors"
          formName="itemBackgroundColorsSecondary"
          selectedItems={selectedItems}
          valueName="Color"
          blockMasterOption={
            selectedBlockOptions?.itemBackgroundColorsSecondary
          }
          defaultValues={defaultValues?.itemBackgroundColorsSecondary}
          type="bg"
        />

        <ItemSelectInput
          title="Secondary Background Width"
          formName="itemBackgroundWidthsSecondary"
          selectedItems={selectedItems}
          valueName="BG Width"
          blockMasterOption={
            selectedBlockOptions?.itemBackgroundWidthsSecondary
          }
          defaultValues={defaultValues?.itemBackgroundWidthsSecondary}
          selections={blockWidthSelectValues}
        />

        <ItemInput
          title="Secondary Background Brightness"
          formName="itemBackgroundBrightnessesSecondary"
          selectedItems={selectedItems}
          valueName="BG Brightness"
          type="number"
          blockMasterOption={
            selectedBlockOptions?.itemBackgroundBrightnessesSecondary
          }
          defaultValues={defaultValues?.itemBackgroundBrightnessesSecondary}
        />

        <ItemSelectInput
          title="Secondary Background Pattern"
          formName="itemBackgroundPatternNamesSecondary"
          selectedItems={selectedItems}
          valueName="BG Pattern"
          blockMasterOption={
            selectedBlockOptions?.itemBackgroundPatternNamesSecondary
          }
          defaultValues={defaultValues?.itemBackgroundPatternNamesSecondary}
          selections={backgroundPatternSelectValues}
        />

        <ItemColorInput
          title="Secondary Background Pattern Color"
          formName="itemBackgroundPatternColorsSecondary"
          selectedItems={selectedItems}
          valueName="BG Pattern Color"
          blockMasterOption={
            selectedBlockOptions?.itemBackgroundPatternColorsSecondary
          }
          defaultValues={defaultValues?.itemBackgroundPatternColorsSecondary}
          type="bg"
        />

        <ItemInput
          title="Secondary Background Pattern Opacity"
          formName="itemBackgroundPatternOpacitiesSecondary"
          selectedItems={selectedItems}
          valueName="BG Pattern Opacity"
          type="number"
          blockMasterOption={
            selectedBlockOptions?.itemBackgroundPatternOpacitiesSecondary
          }
          defaultValues={defaultValues?.itemBackgroundPatternOpacitiesSecondary}
        />

        <ItemInput
          title="Secondary Background Pattern Size"
          formName="itemBackgroundPatternSizesSecondary"
          selectedItems={selectedItems}
          valueName="BG Pattern Size"
          type="number"
          blockMasterOption={
            selectedBlockOptions?.itemBackgroundPatternSizesSecondary
          }
          defaultValues={defaultValues?.itemBackgroundPatternSizesSecondary}
        />
      </div>
    </details>
  );
};

export default Backgrounds;
