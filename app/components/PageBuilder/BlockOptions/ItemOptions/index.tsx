import type { BlockMasterOptions } from "~/utility/blockMaster/types";
import type { BlockOptions } from "@prisma/client";
import ItemInput from "../Components/Items/ItemInput";
import ItemSelectInput from "../Components/Items/ItemSelectInput";
import { filterSelectValues } from "../Values/filters";
import {
  borderDisplaySelectValues,
  borderRadiusSelectValues,
  borderSizeSelectValues,
} from "../Values/borders";
import ItemColorInput from "../Components/Items/ItemColorInput";
import {
  fontSizeSelectValues,
  mobileFontSizeSelectValues,
} from "../Values/font";
import {
  alignSelectMobileValues,
  alignSelectValues,
  justifySelectMobileValues,
  justifySelectValues,
  objectPositionMobileSelectValues,
  objectPositionSelectValues,
} from "../Values/position";
import { buttonStyleSelectValues } from "../Values/buttons";

type Props = {
  selectedItems: ContentSelection[];
  defaultValues?: BlockOptions;
  selectedBlockOptions: BlockMasterOptions | undefined;
};

const ItemOptions = ({
  selectedItems,
  selectedBlockOptions,
  defaultValues,
}: Props) => {
  return (
    <>
      {/* <details className="collapse collapse-plus !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
        <summary className="collapse-title text-xl font-medium">
          Borders
        </summary>
        <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">

        </div>
        </details> */}

      <details className="collapse collapse-plus !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
        <summary className="collapse-title text-xl font-medium">
          Buttons
        </summary>
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
            title="Primary Button Label"
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
            blockMasterOption={
              selectedBlockOptions?.itemPrimaryButtonLabelColors
            }
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
            title="Secondary Button Label"
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

      <details className="collapse collapse-plus !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
        <summary className="collapse-title text-xl font-medium">
          Alignment
        </summary>
        <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
          <ItemSelectInput
            title="Justify"
            formName="itemJustify"
            selectedItems={selectedItems}
            valueName="Justify"
            blockMasterOption={selectedBlockOptions?.itemJustify}
            defaultValues={defaultValues?.itemJustify}
            selections={justifySelectValues}
          />

          <ItemSelectInput
            title="Justify Mobile"
            formName="itemJustifyMobile"
            selectedItems={selectedItems}
            valueName="Justify Mobile"
            blockMasterOption={selectedBlockOptions?.itemJustifyMobile}
            defaultValues={defaultValues?.itemJustifyMobile}
            selections={justifySelectMobileValues}
          />

          <ItemSelectInput
            title="Align"
            formName="itemAlign"
            selectedItems={selectedItems}
            valueName="Align"
            blockMasterOption={selectedBlockOptions?.itemAlign}
            defaultValues={defaultValues?.itemAlign}
            selections={alignSelectValues}
          />

          <ItemSelectInput
            title="Align Mobile"
            formName="itemAlignMobile"
            selectedItems={selectedItems}
            valueName="Align Mobile"
            blockMasterOption={selectedBlockOptions?.itemAlignMobile}
            defaultValues={defaultValues?.itemAlignMobile}
            selections={alignSelectMobileValues}
          />

          <ItemSelectInput
            title="Image Focus"
            formName="itemImagePositions"
            selectedItems={selectedItems}
            valueName="Image Focus"
            blockMasterOption={selectedBlockOptions?.itemImagePositions}
            defaultValues={defaultValues?.itemImagePositions}
            selections={objectPositionSelectValues}
          />

          <ItemSelectInput
            title="Image Focus Mobile"
            formName="itemImagePositionsMobile"
            selectedItems={selectedItems}
            valueName="Image Focus Mobile"
            blockMasterOption={selectedBlockOptions?.itemImagePositionsMobile}
            defaultValues={defaultValues?.itemImagePositionsMobile}
            selections={objectPositionMobileSelectValues}
          />
        </div>
      </details>

      <details className="collapse collapse-plus !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
        <summary className="collapse-title text-xl font-medium">
          Borders
        </summary>
        <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
          <ItemSelectInput
            title="Border Displays"
            formName="itemBorderDisplays"
            selectedItems={selectedItems}
            valueName="Border Display"
            blockMasterOption={selectedBlockOptions?.itemBorderDisplays}
            defaultValues={defaultValues?.itemBorderDisplays}
            selections={borderDisplaySelectValues}
          />

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

          <ItemColorInput
            title="Border Colors"
            formName="itemBorderColors"
            selectedItems={selectedItems}
            valueName="Border Color"
            blockMasterOption={selectedBlockOptions?.itemBorderColors}
            defaultValues={defaultValues?.itemBorderColors}
            type="border"
          />

          <ItemSelectInput
            title="Border Radius"
            formName="itemBorderRadius"
            selectedItems={selectedItems}
            valueName="Border Radius"
            blockMasterOption={selectedBlockOptions?.itemBorderRadius}
            defaultValues={defaultValues?.itemBorderRadius}
            selections={borderRadiusSelectValues}
          />

          <ItemSelectInput
            title="Border Sizes"
            formName="itemBorderSizes"
            selectedItems={selectedItems}
            valueName="Border Radius"
            blockMasterOption={selectedBlockOptions?.itemBorderSizes}
            defaultValues={defaultValues?.itemBorderSizes}
            selections={borderSizeSelectValues}
          />
        </div>
      </details>

      <details className="collapse collapse-plus !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
        <summary className="collapse-title text-xl font-medium">Colors</summary>
        <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
          <ItemColorInput
            title="Item Colors"
            formName="itemColors"
            selectedItems={selectedItems}
            valueName="Color"
            blockMasterOption={selectedBlockOptions?.itemColors}
            defaultValues={defaultValues?.itemColors}
          />
          <ItemColorInput
            title="Secondary Colors"
            formName="itemSecondaryColors"
            selectedItems={selectedItems}
            valueName="Secondary Color"
            blockMasterOption={selectedBlockOptions?.itemSecondaryColors}
            defaultValues={defaultValues?.itemSecondaryColors}
          />
        </div>
      </details>

      <details className="collapse collapse-plus !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
        <summary className="collapse-title text-xl font-medium">
          Effects
        </summary>
        <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
          <ItemSelectInput
            title="Filters"
            formName="itemFilters"
            selectedItems={selectedItems}
            valueName="Filter"
            blockMasterOption={selectedBlockOptions?.itemFilters}
            defaultValues={defaultValues?.itemFilters}
            selections={filterSelectValues}
          />
        </div>
      </details>

      <details className="collapse collapse-plus !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
        <summary className="collapse-title text-xl font-medium">Links</summary>
        <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
          <ItemInput
            title="Links"
            formName="itemLinks"
            selectedItems={selectedItems}
            valueName="Link"
            blockMasterOption={selectedBlockOptions?.itemLinks}
            defaultValues={defaultValues?.itemLinks}
          />
        </div>
      </details>

      <details className="collapse collapse-plus !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
        <summary className="collapse-title text-xl font-medium">Text</summary>
        <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
          <ItemInput
            title="Short Text"
            formName="itemShortText"
            selectedItems={selectedItems}
            valueName="Short Text"
            blockMasterOption={selectedBlockOptions?.itemShortText}
            defaultValues={defaultValues?.itemShortText}
          />

          <ItemColorInput
            title="Short Text Colors"
            formName="itemShortTextColors"
            selectedItems={selectedItems}
            valueName="Short Text Color"
            blockMasterOption={selectedBlockOptions?.itemShortTextColors}
            defaultValues={defaultValues?.itemShortTextColors}
            type="text"
          />

          <ItemSelectInput
            title="Short Text Sizes"
            formName="itemShortTextSizes"
            selectedItems={selectedItems}
            valueName="Short Text Size"
            blockMasterOption={selectedBlockOptions?.itemShortTextSizes}
            defaultValues={defaultValues?.itemShortTextSizes}
            selections={fontSizeSelectValues}
          />

          <ItemSelectInput
            title="Short Text Sizes Mobile"
            formName="itemShortTextSizesMobile"
            selectedItems={selectedItems}
            valueName="Short Text Size Mobile"
            blockMasterOption={selectedBlockOptions?.itemShortTextSizesMobile}
            defaultValues={defaultValues?.itemShortTextSizesMobile}
            selections={mobileFontSizeSelectValues}
          />
        </div>
      </details>

      <details className="collapse collapse-plus !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
        <summary className="collapse-title text-xl font-medium">Titles</summary>
        <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
          <ItemInput
            title="Titles"
            formName="itemTitles"
            selectedItems={selectedItems}
            valueName="Title"
            blockMasterOption={selectedBlockOptions?.itemTitles}
            defaultValues={defaultValues?.itemTitles}
          />

          <ItemColorInput
            title="Title Colors"
            formName="itemTitleColors"
            selectedItems={selectedItems}
            valueName="Title Color"
            blockMasterOption={selectedBlockOptions?.itemTitleColors}
            defaultValues={defaultValues?.itemTitleColors}
            type="text"
          />

          <ItemSelectInput
            title="Title Sizes"
            formName="itemTitleSizes"
            selectedItems={selectedItems}
            valueName="Title Size"
            blockMasterOption={selectedBlockOptions?.itemTitleSizes}
            defaultValues={defaultValues?.itemTitleSizes}
            selections={fontSizeSelectValues}
          />

          <ItemSelectInput
            title="Title Sizes Mobile"
            formName="itemTitleSizesMobile"
            selectedItems={selectedItems}
            valueName="Title Size Mobile"
            blockMasterOption={selectedBlockOptions?.itemTitleSizesMobile}
            defaultValues={defaultValues?.itemTitleSizesMobile}
            selections={mobileFontSizeSelectValues}
          />
        </div>
      </details>
    </>
  );
};

export default ItemOptions;
