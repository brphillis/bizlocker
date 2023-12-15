import type { BlockOptions } from "@prisma/client";
import { hasTruePropertyStartingWith } from "~/helpers/objectHelpers";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";
import BlockInput from "../../Components/BlockInput";
import { blockWidthSelectValues } from "../../Values/width";
import BlockSelectInput from "../../Components/BlockSelectInput";
import { backgroundPatternSelectValues } from "../../Values/background";
import { backgroundColorSelection, colorSelection } from "../../Values/colors";
import BlockColorInput from "../../Components/BlockColorInput";

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
      <details className="bg-brand-white/20 collapse collapse-plus !hidden !max-w-full !rounded-sm [&:has(div>div)]:!grid">
        <summary className="collapse-title text-xl font-medium">
          Background
        </summary>
        <div className="collapse-content relative sm:!px-3">
          <div className="flex max-w-full flex-wrap justify-start !gap-3 pb-3 max-md:justify-center">
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

            <BlockSelectInput
              valueName="Background Pattern Color"
              formName="backgroundPatternColor"
              blockMasterOption={selectedBlockOptions?.backgroundPatternColor}
              defaultValue={defaultValues?.backgroundPatternColor}
              selections={colorSelection}
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

            <BlockSelectInput
              valueName="Background Color 2"
              formName="backgroundColorSecondary"
              blockMasterOption={selectedBlockOptions?.backgroundColorSecondary}
              defaultValue={defaultValues?.backgroundColorSecondary}
              selections={backgroundColorSelection}
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

            <BlockSelectInput
              valueName="Background Pattern Color 2"
              formName="backgroundPatternColorSecondary"
              blockMasterOption={
                selectedBlockOptions?.backgroundPatternColorSecondary
              }
              defaultValue={defaultValues?.backgroundPatternColorSecondary}
              selections={colorSelection}
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
