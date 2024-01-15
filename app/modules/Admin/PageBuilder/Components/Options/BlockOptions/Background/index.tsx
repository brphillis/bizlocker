import type { BlockOptions } from "@prisma/client";
import { hasTruePropertyStartingWith } from "~/helpers/objectHelpers";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";
import { blockWidthSelectValues } from "../../Values/width";
import { backgroundPatternSelectValues } from "../../Values/background";
import { containerDisplaySelectValues } from "../../Values/basic";
import BlockSelectInput from "../../FieldComponents/Blocks/BlockSelectInput";
import BlockColorInput from "../../FieldComponents/Blocks/BlockColorInput";
import BlockInput from "../../FieldComponents/Blocks/BlockInput";

type Props = {
  defaultValues?: BlockOptions;
  selectedBlockOptions?: BlockMasterOptions;
};

const BackgroundOptions = ({ defaultValues, selectedBlockOptions }: Props) => {
  if (
    selectedBlockOptions &&
    hasTruePropertyStartingWith("background", selectedBlockOptions)
  ) {
    return (
      <details className="collapse collapse-plus !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
        <summary className="collapse-title text-xl font-medium !text-brand-white">
          Background
        </summary>
        <div className="collapse-content relative sm:!px-3">
          <div className="flex max-w-full flex-wrap justify-start !gap-3 max-md:justify-center">
            <BlockSelectInput
              valueName="Display Background"
              formName="backgroundDisplay"
              blockMasterOption={selectedBlockOptions?.backgroundDisplay}
              defaultValue={defaultValues?.backgroundDisplay}
              selections={containerDisplaySelectValues}
            />

            <BlockColorInput
              valueName="Background Color"
              formName="backgroundColor"
              blockMasterOption={selectedBlockOptions?.backgroundColor}
              defaultValue={defaultValues?.backgroundColor}
              type="bg"
            />

            <BlockSelectInput
              valueName="Width"
              formName="backgroundWidth"
              blockMasterOption={selectedBlockOptions?.backgroundWidth}
              defaultValue={defaultValues?.backgroundWidth}
              selections={blockWidthSelectValues}
            />

            <BlockInput
              valueName="Background Brightness"
              formName="backgroundBrightness"
              blockMasterOption={selectedBlockOptions?.backgroundBrightness}
              defaultValue={defaultValues?.backgroundBrightness}
              type="number"
              tooltip="Brightness Filter ( Blank for Default )"
            />

            <BlockSelectInput
              valueName="Background Pattern"
              formName="backgroundPatternName"
              blockMasterOption={selectedBlockOptions?.backgroundPatternName}
              defaultValue={defaultValues?.backgroundPatternName}
              selections={backgroundPatternSelectValues}
            />

            <BlockColorInput
              valueName="Background Pattern Color"
              formName="backgroundPatternColor"
              blockMasterOption={selectedBlockOptions?.backgroundPatternColor}
              defaultValue={defaultValues?.backgroundPatternColor}
            />

            <BlockInput
              valueName="Background Pattern Size"
              formName="backgroundPatternSize"
              blockMasterOption={selectedBlockOptions?.backgroundPatternSize}
              defaultValue={defaultValues?.backgroundPatternSize}
              tooltip="Size of Pattern"
              type="number"
              max="120"
            />

            <BlockInput
              valueName="Background Pattern Opacity"
              formName="backgroundPatternOpacity"
              blockMasterOption={selectedBlockOptions?.backgroundPatternOpacity}
              defaultValue={defaultValues?.backgroundPatternOpacity}
              type="number"
            />

            <BlockColorInput
              valueName="Background Color 2"
              formName="backgroundColorSecondary"
              blockMasterOption={selectedBlockOptions?.backgroundColorSecondary}
              defaultValue={defaultValues?.backgroundColorSecondary}
              type="bg"
            />

            <BlockSelectInput
              valueName="Width 2"
              formName="backgroundWidthSecondary"
              blockMasterOption={selectedBlockOptions?.backgroundWidthSecondary}
              defaultValue={defaultValues?.backgroundWidthSecondary}
              selections={blockWidthSelectValues}
            />

            <BlockInput
              valueName="Background Brightness 2"
              formName="backgroundBrightnessSecondary"
              blockMasterOption={
                selectedBlockOptions?.backgroundBrightnessSecondary
              }
              defaultValue={defaultValues?.backgroundBrightnessSecondary}
              type="number"
              tooltip="Brightness Filter ( Blank for Default )"
            />

            <BlockSelectInput
              valueName="Background Pattern 2"
              formName="backgroundPatternNameSecondary"
              blockMasterOption={
                selectedBlockOptions?.backgroundPatternNameSecondary
              }
              defaultValue={defaultValues?.backgroundPatternNameSecondary}
              selections={backgroundPatternSelectValues}
            />

            <BlockColorInput
              valueName="Background Pattern Color 2"
              formName="backgroundPatternColorSecondary"
              blockMasterOption={
                selectedBlockOptions?.backgroundPatternColorSecondary
              }
              defaultValue={defaultValues?.backgroundPatternColorSecondary}
            />

            <BlockInput
              valueName="Background Pattern Size 2"
              formName="backgroundPatternSizeSecondary"
              blockMasterOption={
                selectedBlockOptions?.backgroundPatternSizeSecondary
              }
              defaultValue={defaultValues?.backgroundPatternSizeSecondary}
              tooltip="Size of Pattern"
              type="number"
              max="120"
            />

            <BlockInput
              valueName="Background Pattern Opacity 2"
              formName="backgroundPatternOpacitySecondary"
              blockMasterOption={
                selectedBlockOptions?.backgroundPatternOpacitySecondary
              }
              defaultValue={defaultValues?.backgroundPatternOpacitySecondary}
              type="number"
            />
          </div>
        </div>
      </details>
    );
  } else return <></>;
};

export default BackgroundOptions;
