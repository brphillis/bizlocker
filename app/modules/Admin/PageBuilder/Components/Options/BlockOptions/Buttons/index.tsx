import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";
import { buttonStyleSelectValues } from "../../Values/buttons";
import { flexAlignSelectValues } from "../../Values/basic";
import BlockSelectInput from "../_FieldComponents/BlockSelectInput";
import BlockColorInput from "../_FieldComponents/BlockColorInput";
import BlockInput from "../_FieldComponents/BlockInput";
import Divider from "~/components/Filter/ProductFilterSideBar/Divider";

type Props = {
  defaultValues?: BlockOptions;
  selectedBlockOptions?: BlockMasterOptions;
};

const ButtonOptions = ({ defaultValues, selectedBlockOptions }: Props) => {
  return (
    <details className="collapse collapse-plus !hidden !max-w-[100vw] max-md:!w-[100dvw] !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium !text-brand-white !max-w-full">
        Buttons
      </summary>
      <div className="flex flex-col gap-3 flex-wrap items-start justify-start w-full px-3 pb-6 max-md:pb-3">
        <BlockSelectInput
          valueName="Button Align"
          formName="buttonAlign"
          blockMasterOption={selectedBlockOptions?.buttonAlign}
          defaultValue={defaultValues?.buttonAlign}
          selections={flexAlignSelectValues}
        />

        {Object.keys(selectedBlockOptions || {}).some(
          (key) => key.startsWith("button") && key.endsWith("Primary"),
        ) && (
          <div className="pt-3 pl-1 text-sm font-medium text-brand-white">
            Primary Button
          </div>
        )}

        {Object.keys(selectedBlockOptions || {}).some(
          (key) => key.startsWith("button") && key.endsWith("Primary"),
        ) && (
          <div className="flex flex-row gap-3 flex-wrap justify-start w-full">
            <BlockSelectInput
              valueName="Style"
              formName="buttonPrimary"
              blockMasterOption={selectedBlockOptions?.buttonPrimary}
              defaultValue={defaultValues?.buttonPrimary}
              selections={buttonStyleSelectValues}
            />

            <BlockColorInput
              valueName="Color"
              formName="buttonColorPrimary"
              blockMasterOption={selectedBlockOptions?.buttonColorPrimary}
              defaultValue={defaultValues?.buttonColorPrimary}
              type="bg"
            />

            <BlockColorInput
              valueName="Border Color"
              formName="buttonBorderColorPrimary"
              blockMasterOption={selectedBlockOptions?.buttonBorderColorPrimary}
              defaultValue={defaultValues?.buttonBorderColorPrimary}
              type="border"
            />

            <BlockInput
              valueName="Label"
              formName="buttonLabelPrimary"
              blockMasterOption={selectedBlockOptions?.buttonLabelPrimary}
              defaultValue={defaultValues?.buttonLabelPrimary}
            />

            <BlockColorInput
              valueName="Label Color"
              formName="buttonLabelColorPrimary"
              blockMasterOption={selectedBlockOptions?.buttonLabelColorPrimary}
              defaultValue={defaultValues?.buttonLabelColorPrimary}
              type="text"
            />

            <BlockInput
              valueName="Link"
              formName="buttonLinkPrimary"
              blockMasterOption={selectedBlockOptions?.buttonLinkPrimary}
              defaultValue={defaultValues?.buttonLinkPrimary}
            />
          </div>
        )}

        {Object.keys(selectedBlockOptions || {}).some(
          (key) => key.startsWith("button") && key.endsWith("Secondary"),
        ) && (
          <>
            <Divider color="white" />

            <div className="pl-1 text-sm font-medium text-brand-white">
              Secondary Button
            </div>
          </>
        )}

        {Object.keys(selectedBlockOptions || {}).some(
          (key) => key.startsWith("button") && key.endsWith("Secondary"),
        ) && (
          <div className="flex flex-row gap-3 flex-wrap justify-start w-full">
            <BlockSelectInput
              valueName="Style"
              formName="buttonSecondary"
              blockMasterOption={selectedBlockOptions?.buttonSecondary}
              defaultValue={defaultValues?.buttonSecondary}
              selections={buttonStyleSelectValues}
            />

            <BlockColorInput
              valueName="Color"
              formName="buttonColorSecondary"
              blockMasterOption={selectedBlockOptions?.buttonColorSecondary}
              defaultValue={defaultValues?.buttonColorSecondary}
              type="bg"
            />

            <BlockColorInput
              valueName="Border Color"
              formName="buttonBorderColorSecondary"
              blockMasterOption={
                selectedBlockOptions?.buttonBorderColorSecondary
              }
              defaultValue={defaultValues?.buttonBorderColorSecondary}
              type="border"
            />

            <BlockInput
              valueName="Button Label"
              formName="buttonLabelSecondary"
              blockMasterOption={selectedBlockOptions?.buttonLabelSecondary}
              defaultValue={defaultValues?.buttonLabelSecondary}
            />

            <BlockColorInput
              valueName="Label Color"
              formName="buttonLabelColorSecondary"
              blockMasterOption={
                selectedBlockOptions?.buttonLabelColorSecondary
              }
              defaultValue={defaultValues?.buttonLabelColorSecondary}
              type="text"
            />

            <BlockInput
              valueName="Link"
              formName="buttonLinkSecondary"
              blockMasterOption={selectedBlockOptions?.buttonLinkSecondary}
              defaultValue={defaultValues?.buttonLinkSecondary}
            />
          </div>
        )}
      </div>
    </details>
  );
};

export default ButtonOptions;
