import type { BlockOptions } from "@prisma/client";
import { hasTruePropertyStartingWith } from "~/helpers/objectHelpers";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";
import { blockWidthSelectValues } from "../../Values/width";
import { backgroundPatternSelectValues } from "../../Values/background";
import { containerDisplaySelectValues } from "../../Values/basic";
import BlockSelectInput from "../_FieldComponents/BlockSelectInput";
import BlockColorInput from "../_FieldComponents/BlockColorInput";
import BlockInput from "../_FieldComponents/BlockInput";
import Divider from "~/components/Filter/ProductFilterSideBar/Divider";

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
      <details className="collapse collapse-plus !hidden !max-w-[100vw] max-md:!w-[100dvw] !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
        <summary className="collapse-title text-xl font-medium !text-brand-white !max-w-full">
          Background
        </summary>

        <div className="flex flex-col gap-3 flex-wrap items-start justify-start w-full px-3 pb-6 max-md:pb-3">
          {Object.keys(selectedBlockOptions || {}).some(
            (key) => key.startsWith("background") && key.endsWith("Primary"),
          ) && (
            <div className="pt-3 pl-1 text-sm font-medium text-brand-white">
              Primary Background
            </div>
          )}

          {Object.keys(selectedBlockOptions || {}).some(
            (key) => key.startsWith("background") && key.endsWith("Primary"),
          ) && (
            <div className="flex flex-row gap-3 flex-wrap justify-start w-full">
              <BlockSelectInput
                valueName="Display"
                formName="backgroundDisplayPrimary"
                blockMasterOption={
                  selectedBlockOptions?.backgroundDisplayPrimary
                }
                defaultValue={defaultValues?.backgroundDisplayPrimary}
                selections={containerDisplaySelectValues}
              />

              <BlockColorInput
                valueName="Color"
                formName="backgroundColorPrimary"
                blockMasterOption={selectedBlockOptions?.backgroundColorPrimary}
                defaultValue={defaultValues?.backgroundColorPrimary}
                type="bg"
              />

              <BlockSelectInput
                valueName="Width"
                formName="backgroundWidthPrimary"
                blockMasterOption={selectedBlockOptions?.backgroundWidthPrimary}
                defaultValue={defaultValues?.backgroundWidthPrimary}
                selections={blockWidthSelectValues}
              />

              <BlockInput
                valueName="Brightness"
                formName="backgroundBrightnessPrimary"
                blockMasterOption={
                  selectedBlockOptions?.backgroundBrightnessPrimary
                }
                defaultValue={defaultValues?.backgroundBrightnessPrimary}
                type="number"
                tooltip="Brightness Filter ( Blank for Default )"
              />

              <BlockSelectInput
                valueName="Pattern"
                formName="backgroundPatternNamePrimary"
                blockMasterOption={
                  selectedBlockOptions?.backgroundPatternNamePrimary
                }
                defaultValue={defaultValues?.backgroundPatternNamePrimary}
                selections={backgroundPatternSelectValues}
              />

              <BlockColorInput
                valueName="Pattern Color"
                formName="backgroundPatternColorPrimary"
                blockMasterOption={
                  selectedBlockOptions?.backgroundPatternColorPrimary
                }
                defaultValue={defaultValues?.backgroundPatternColorPrimary}
              />

              <BlockInput
                valueName="Pattern Size"
                formName="backgroundPatternSizePrimary"
                blockMasterOption={
                  selectedBlockOptions?.backgroundPatternSizePrimary
                }
                defaultValue={defaultValues?.backgroundPatternSizePrimary}
                tooltip="Size of Pattern"
                type="number"
                max="120"
              />

              <BlockInput
                valueName="Pattern Opacity"
                formName="backgroundPatternOpacityPrimary"
                blockMasterOption={
                  selectedBlockOptions?.backgroundPatternOpacityPrimary
                }
                defaultValue={defaultValues?.backgroundPatternOpacityPrimary}
                type="number"
              />
            </div>
          )}

          {Object.keys(selectedBlockOptions || {}).some(
            (key) => key.startsWith("background") && key.endsWith("Secondary"),
          ) && (
            <>
              <Divider color="white" />

              <div className="pl-1 text-sm font-medium text-brand-white">
                Secondary Background
              </div>
            </>
          )}

          {Object.keys(selectedBlockOptions || {}).some(
            (key) => key.startsWith("background") && key.endsWith("Primary"),
          ) && (
            <div className="flex flex-row gap-3 flex-wrap justify-start w-full">
              <BlockSelectInput
                valueName="Background"
                formName="backgroundDisplaySecondary"
                blockMasterOption={
                  selectedBlockOptions?.backgroundDisplaySecondary
                }
                defaultValue={defaultValues?.backgroundDisplaySecondary}
                selections={containerDisplaySelectValues}
              />

              <BlockColorInput
                valueName="Color"
                formName="backgroundColorSecondary"
                blockMasterOption={
                  selectedBlockOptions?.backgroundColorSecondary
                }
                defaultValue={defaultValues?.backgroundColorSecondary}
                type="bg"
              />

              <BlockSelectInput
                valueName="Width"
                formName="backgroundWidthSecondary"
                blockMasterOption={
                  selectedBlockOptions?.backgroundWidthSecondary
                }
                defaultValue={defaultValues?.backgroundWidthSecondary}
                selections={blockWidthSelectValues}
              />

              <BlockInput
                valueName="Brightness"
                formName="backgroundBrightnessSecondary"
                blockMasterOption={
                  selectedBlockOptions?.backgroundBrightnessSecondary
                }
                defaultValue={defaultValues?.backgroundBrightnessSecondary}
                type="number"
                tooltip="Brightness Filter ( Blank for Default )"
              />

              <BlockSelectInput
                valueName="Pattern"
                formName="backgroundPatternNameSecondary"
                blockMasterOption={
                  selectedBlockOptions?.backgroundPatternNameSecondary
                }
                defaultValue={defaultValues?.backgroundPatternNameSecondary}
                selections={backgroundPatternSelectValues}
              />

              <BlockColorInput
                valueName="Pattern Color"
                formName="backgroundPatternColorSecondary"
                blockMasterOption={
                  selectedBlockOptions?.backgroundPatternColorSecondary
                }
                defaultValue={defaultValues?.backgroundPatternColorSecondary}
              />

              <BlockInput
                valueName="Pattern Size"
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
                valueName="Pattern Opacity"
                formName="backgroundPatternOpacitySecondary"
                blockMasterOption={
                  selectedBlockOptions?.backgroundPatternOpacitySecondary
                }
                defaultValue={defaultValues?.backgroundPatternOpacitySecondary}
                type="number"
              />
            </div>
          )}
        </div>
      </details>
    );
  } else return <></>;
};

export default BackgroundOptions;
