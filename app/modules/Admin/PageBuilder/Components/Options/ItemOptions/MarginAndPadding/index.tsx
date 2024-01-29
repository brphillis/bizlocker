import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/types";
import ItemSelectInput from "../_FieldComponents/ItemSelectInput";
import {
  itemMarginBottomSelectValues,
  itemMarginLeftSelectValues,
  itemMarginRightSelectValues,
  itemMarginTopSelectValues,
  itemPaddingBottomSelectValues,
  itemPaddingLeftSelectValues,
  itemPaddingRightSelectValues,
  itemPaddingTopSelectValues,
  mobileItemMarginBottomSelectValues,
  mobileItemMarginLeftSelectValues,
  mobileItemMarginRightSelectValues,
  mobileItemMarginTopSelectValues,
  mobileItemPaddingBottomSelectValues,
  mobileItemPaddingLeftSelectValues,
  mobileItemPaddingRightSelectValues,
  mobileItemPaddingTopSelectValues,
} from "../../Values/marginAndPadding";
import Divider from "~/components/Filter/ProductFilterSideBar/Divider";

type Props = {
  selectedItems: PageBuilderContentSelection[];
  defaultValues?: BlockOptions;
  selectedBlockOptions: BlockMasterOptions | undefined;
};

const PaddingAndPadding = ({
  selectedItems,
  defaultValues,
  selectedBlockOptions,
}: Props) => {
  return (
    <details className="collapse collapse-plus !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium text-brand-white">
        Margin & Padding
      </summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        {Object.keys(selectedBlockOptions || {}).some((key) =>
          key.startsWith("itemMargin"),
        ) && (
          <div className="pt-3 pl-1 text-sm font-medium text-brand-white">
            Margin
          </div>
        )}

        <ItemSelectInput
          title="Top"
          formName="itemMarginTop"
          selectedItems={selectedItems}
          valueName="Top"
          blockMasterOption={selectedBlockOptions?.itemMarginTop}
          defaultValues={defaultValues?.itemMarginTop}
          selections={itemMarginTopSelectValues}
        />

        <ItemSelectInput
          title="Right"
          formName="itemMarginRight"
          selectedItems={selectedItems}
          valueName="Right"
          blockMasterOption={selectedBlockOptions?.itemMarginRight}
          defaultValues={defaultValues?.itemMarginRight}
          selections={itemMarginRightSelectValues}
        />

        <ItemSelectInput
          title="Bottom"
          formName="itemMarginBottom"
          selectedItems={selectedItems}
          valueName="Right"
          blockMasterOption={selectedBlockOptions?.itemMarginBottom}
          defaultValues={defaultValues?.itemMarginBottom}
          selections={itemMarginBottomSelectValues}
        />

        <ItemSelectInput
          title="Left"
          formName="itemMarginLeft"
          selectedItems={selectedItems}
          valueName="Left"
          blockMasterOption={selectedBlockOptions?.itemMarginLeft}
          defaultValues={defaultValues?.itemMarginLeft}
          selections={itemMarginLeftSelectValues}
        />

        {Object.keys(selectedBlockOptions || {}).some(
          (key) => key.startsWith("itemMargin") && key.endsWith("Mobile"),
        ) && (
          <>
            <Divider color="white" />

            <div className="pl-1 text-sm font-medium text-brand-white">
              Margin Mobile
            </div>
          </>
        )}

        <ItemSelectInput
          title="Top"
          formName="itemMarginTopMobile"
          selectedItems={selectedItems}
          valueName="Top"
          blockMasterOption={selectedBlockOptions?.itemMarginTopMobile}
          defaultValues={defaultValues?.itemMarginTopMobile}
          selections={mobileItemMarginTopSelectValues}
        />

        <ItemSelectInput
          title="Right"
          formName="itemMarginRightMobile"
          selectedItems={selectedItems}
          valueName="Right"
          blockMasterOption={selectedBlockOptions?.itemMarginRightMobile}
          defaultValues={defaultValues?.itemMarginRightMobile}
          selections={mobileItemMarginRightSelectValues}
        />

        <ItemSelectInput
          title="Bottom"
          formName="itemMarginBottomMobile"
          selectedItems={selectedItems}
          valueName="Bottom"
          blockMasterOption={selectedBlockOptions?.itemMarginBottomMobile}
          defaultValues={defaultValues?.itemMarginBottomMobile}
          selections={mobileItemMarginBottomSelectValues}
        />

        <ItemSelectInput
          title="Left"
          formName="itemMarginLeftMobile"
          selectedItems={selectedItems}
          valueName="Left"
          blockMasterOption={selectedBlockOptions?.itemMarginLeftMobile}
          defaultValues={defaultValues?.itemMarginLeftMobile}
          selections={mobileItemMarginLeftSelectValues}
        />

        {Object.keys(selectedBlockOptions || {}).some((key) =>
          key.startsWith("itemPadding"),
        ) && (
          <>
            <Divider color="white" />

            <div className="pl-1 text-sm font-medium text-brand-white">
              Padding
            </div>
          </>
        )}

        <ItemSelectInput
          title="Top"
          formName="itemPaddingTop"
          selectedItems={selectedItems}
          valueName="Top"
          blockMasterOption={selectedBlockOptions?.itemPaddingTop}
          defaultValues={defaultValues?.itemPaddingTop}
          selections={itemPaddingTopSelectValues}
        />

        <ItemSelectInput
          title="Right"
          formName="itemPaddingRight"
          selectedItems={selectedItems}
          valueName="Right"
          blockMasterOption={selectedBlockOptions?.itemPaddingRight}
          defaultValues={defaultValues?.itemPaddingRight}
          selections={itemPaddingRightSelectValues}
        />

        <ItemSelectInput
          title="Bottom"
          formName="itemPaddingBottom"
          selectedItems={selectedItems}
          valueName="Right"
          blockMasterOption={selectedBlockOptions?.itemPaddingBottom}
          defaultValues={defaultValues?.itemPaddingBottom}
          selections={itemPaddingBottomSelectValues}
        />

        <ItemSelectInput
          title="Left"
          formName="itemPaddingLeft"
          selectedItems={selectedItems}
          valueName="Left"
          blockMasterOption={selectedBlockOptions?.itemPaddingLeft}
          defaultValues={defaultValues?.itemPaddingLeft}
          selections={itemPaddingLeftSelectValues}
        />

        {Object.keys(selectedBlockOptions || {}).some(
          (key) => key.startsWith("itemPadding") && key.endsWith("Mobile"),
        ) && (
          <>
            <Divider color="white" />
            <div className="pl-1 text-sm font-medium text-brand-white">
              Padding Mobile
            </div>
          </>
        )}

        <ItemSelectInput
          title="Top"
          formName="itemPaddingTopMobile"
          selectedItems={selectedItems}
          valueName="Top"
          blockMasterOption={selectedBlockOptions?.itemPaddingTopMobile}
          defaultValues={defaultValues?.itemPaddingTopMobile}
          selections={mobileItemPaddingTopSelectValues}
        />

        <ItemSelectInput
          title="Right"
          formName="itemPaddingRightMobile"
          selectedItems={selectedItems}
          valueName="Right"
          blockMasterOption={selectedBlockOptions?.itemPaddingRightMobile}
          defaultValues={defaultValues?.itemPaddingRightMobile}
          selections={mobileItemPaddingRightSelectValues}
        />

        <ItemSelectInput
          title="Bottom"
          formName="itemPaddingBottomMobile"
          selectedItems={selectedItems}
          valueName="Bottom"
          blockMasterOption={selectedBlockOptions?.itemPaddingBottomMobile}
          defaultValues={defaultValues?.itemPaddingBottomMobile}
          selections={mobileItemPaddingBottomSelectValues}
        />

        <ItemSelectInput
          title="Left"
          formName="itemPaddingLeftMobile"
          selectedItems={selectedItems}
          valueName="Left"
          blockMasterOption={selectedBlockOptions?.itemPaddingLeftMobile}
          defaultValues={defaultValues?.itemPaddingLeftMobile}
          selections={mobileItemPaddingLeftSelectValues}
        />
      </div>
    </details>
  );
};

export default PaddingAndPadding;
