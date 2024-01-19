import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/types";
import { backgroundPatternSelectValues } from "../../Values/background";
import { blockWidthSelectValues } from "../../Values/width";
import { containerDisplaySelectValues } from "../../Values/basic";
import ItemSelectInput from "../_FieldComponents/ItemSelectInput";
import ItemColorInput from "../_FieldComponents/ItemColorInput";
import ItemInput from "../_FieldComponents/ItemInput";
import Divider from "~/components/Filter/ProductFilterSideBar/Divider";

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
        {Object.keys(selectedBlockOptions || {}).some(
          (key) => key.startsWith("itemBackground") && key.endsWith("Primary"),
        ) && (
          <div className="pt-3 pl-1 text-sm font-medium text-brand-white">
            Primary Background
          </div>
        )}

        <ItemSelectInput
          title="Background Display"
          formName="itemBackgroundDisplaysPrimary"
          selectedItems={selectedItems}
          valueName="Display"
          blockMasterOption={
            selectedBlockOptions?.itemBackgroundDisplaysPrimary
          }
          defaultValues={defaultValues?.itemBackgroundDisplaysPrimary}
          selections={containerDisplaySelectValues}
        />

        <ItemColorInput
          title="Colors"
          formName="itemBackgroundColorsPrimary"
          selectedItems={selectedItems}
          valueName="Color"
          blockMasterOption={selectedBlockOptions?.itemBackgroundColorsPrimary}
          defaultValues={defaultValues?.itemBackgroundColorsPrimary}
          type="bg"
        />

        <ItemSelectInput
          title="Width"
          formName="itemBackgroundWidthsPrimary"
          selectedItems={selectedItems}
          valueName="Width"
          blockMasterOption={selectedBlockOptions?.itemBackgroundWidthsPrimary}
          defaultValues={defaultValues?.itemBackgroundWidthsPrimary}
          selections={blockWidthSelectValues}
        />

        <ItemInput
          title="Brightness"
          formName="itemBackgroundBrightnessesPrimary"
          selectedItems={selectedItems}
          valueName="Brightness"
          type="number"
          blockMasterOption={
            selectedBlockOptions?.itemBackgroundBrightnessesPrimary
          }
          defaultValues={defaultValues?.itemBackgroundBrightnessesPrimary}
        />

        <ItemSelectInput
          title="Pattern"
          formName="itemBackgroundPatternNamesPrimary"
          selectedItems={selectedItems}
          valueName="Pattern"
          blockMasterOption={
            selectedBlockOptions?.itemBackgroundPatternNamesPrimary
          }
          defaultValues={defaultValues?.itemBackgroundPatternNamesPrimary}
          selections={backgroundPatternSelectValues}
        />

        <ItemColorInput
          title="Pattern Color"
          formName="itemBackgroundPatternColorsPrimary"
          selectedItems={selectedItems}
          valueName="Pattern Color"
          blockMasterOption={
            selectedBlockOptions?.itemBackgroundPatternColorsPrimary
          }
          defaultValues={defaultValues?.itemBackgroundPatternColorsPrimary}
          type="bg"
        />

        <ItemInput
          title="Pattern Opacity"
          formName="itemBackgroundPatternOpacitiesPrimary"
          selectedItems={selectedItems}
          valueName="Pattern Opacity"
          type="number"
          blockMasterOption={
            selectedBlockOptions?.itemBackgroundPatternOpacitiesPrimary
          }
          defaultValues={defaultValues?.itemBackgroundPatternOpacitiesPrimary}
        />

        <ItemInput
          title="Pattern Size"
          formName="itemBackgroundPatternSizesPrimary"
          selectedItems={selectedItems}
          valueName="Pattern Size"
          type="number"
          blockMasterOption={
            selectedBlockOptions?.itemBackgroundPatternSizesPrimary
          }
          defaultValues={defaultValues?.itemBackgroundPatternSizesPrimary}
        />

        {Object.keys(selectedBlockOptions || {}).some(
          (key) =>
            key.startsWith("itemBackground") && key.endsWith("Secondary"),
        ) && (
          <>
            <Divider color="white" />

            <div className="pl-1 text-sm font-medium text-brand-white">
              Secondary Background
            </div>
          </>
        )}

        <ItemSelectInput
          title="Display"
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
          title="Colors"
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
          title="Width"
          formName="itemBackgroundWidthsSecondary"
          selectedItems={selectedItems}
          valueName="Width"
          blockMasterOption={
            selectedBlockOptions?.itemBackgroundWidthsSecondary
          }
          defaultValues={defaultValues?.itemBackgroundWidthsSecondary}
          selections={blockWidthSelectValues}
        />

        <ItemInput
          title="Brightness"
          formName="itemBackgroundBrightnessesSecondary"
          selectedItems={selectedItems}
          valueName="Brightness"
          type="number"
          blockMasterOption={
            selectedBlockOptions?.itemBackgroundBrightnessesSecondary
          }
          defaultValues={defaultValues?.itemBackgroundBrightnessesSecondary}
        />

        <ItemSelectInput
          title="Pattern"
          formName="itemBackgroundPatternNamesSecondary"
          selectedItems={selectedItems}
          valueName="Pattern"
          blockMasterOption={
            selectedBlockOptions?.itemBackgroundPatternNamesSecondary
          }
          defaultValues={defaultValues?.itemBackgroundPatternNamesSecondary}
          selections={backgroundPatternSelectValues}
        />

        <ItemColorInput
          title="Pattern Color"
          formName="itemBackgroundPatternColorsSecondary"
          selectedItems={selectedItems}
          valueName="Pattern Color"
          blockMasterOption={
            selectedBlockOptions?.itemBackgroundPatternColorsSecondary
          }
          defaultValues={defaultValues?.itemBackgroundPatternColorsSecondary}
          type="bg"
        />

        <ItemInput
          title="Pattern Opacity"
          formName="itemBackgroundPatternOpacitiesSecondary"
          selectedItems={selectedItems}
          valueName="Pattern Opacity"
          type="number"
          blockMasterOption={
            selectedBlockOptions?.itemBackgroundPatternOpacitiesSecondary
          }
          defaultValues={defaultValues?.itemBackgroundPatternOpacitiesSecondary}
        />

        <ItemInput
          title="Pattern Size"
          formName="itemBackgroundPatternSizesSecondary"
          selectedItems={selectedItems}
          valueName="Pattern Size"
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
