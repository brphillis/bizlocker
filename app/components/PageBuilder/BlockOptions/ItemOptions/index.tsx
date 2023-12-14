import type { BlockMasterOptions } from "~/utility/blockMaster/types";
import type { BlockOptions } from "@prisma/client";
import ItemInput from "../Components/ItemInput";
import ItemSelectInput from "../Components/ItemSelectInput";
import { filterSelectValues } from "../Values/filters";
import {
  backgroundColorSelection,
  colorSelection,
  textColorSelection,
} from "../Values/colors";
import {
  borderDisplaySelectValues,
  borderRadiusSelectValues,
  borderSizeSelectValues,
} from "../Values/borders";

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
      <ItemSelectInput
        title="Item Colors"
        formName="itemColors"
        selectedItems={selectedItems}
        valueName="Color"
        blockMasterOption={selectedBlockOptions?.itemColors}
        defaultValues={defaultValues?.itemColors}
        selections={colorSelection}
      />

      <ItemSelectInput
        title="Item Secondary Colors"
        formName="itemSecondaryColors"
        selectedItems={selectedItems}
        valueName="Secondary Color"
        blockMasterOption={selectedBlockOptions?.itemSecondaryColors}
        defaultValues={defaultValues?.itemSecondaryColors}
        selections={colorSelection}
      />

      <ItemSelectInput
        title="Item Border Colors"
        formName="itemBorderColors"
        selectedItems={selectedItems}
        valueName="Border Color"
        blockMasterOption={selectedBlockOptions?.itemBorderColors}
        defaultValues={defaultValues?.itemBorderColors}
        selections={colorSelection}
      />

      <ItemSelectInput
        title="Item Border Displays"
        formName="itemBorderDisplays"
        selectedItems={selectedItems}
        valueName="Border Display"
        blockMasterOption={selectedBlockOptions?.itemBorderDisplays}
        defaultValues={defaultValues?.itemBorderDisplays}
        selections={borderDisplaySelectValues}
      />

      <ItemSelectInput
        title="Item Border Radius"
        formName="itemBorderRadius"
        selectedItems={selectedItems}
        valueName="Border Radius"
        blockMasterOption={selectedBlockOptions?.itemBorderRadius}
        defaultValues={defaultValues?.itemBorderRadius}
        selections={borderRadiusSelectValues}
      />

      <ItemSelectInput
        title="Item Border Size"
        formName="itemBorderSizes"
        selectedItems={selectedItems}
        valueName="Border Radius"
        blockMasterOption={selectedBlockOptions?.itemBorderSizes}
        defaultValues={defaultValues?.itemBorderSizes}
        selections={borderSizeSelectValues}
      />

      <ItemSelectInput
        title="Item Background Colors"
        formName="itemBackgroundColors"
        selectedItems={selectedItems}
        valueName="Background Color"
        blockMasterOption={selectedBlockOptions?.itemBackgroundColors}
        defaultValues={defaultValues?.itemBackgroundColors}
        selections={backgroundColorSelection}
      />

      <ItemSelectInput
        title="Item Secondary Background Colors"
        formName="itemSecondaryBackgroundColors"
        selectedItems={selectedItems}
        valueName="Background Color"
        blockMasterOption={selectedBlockOptions?.itemSecondaryBackgroundColors}
        defaultValues={defaultValues?.itemSecondaryBackgroundColors}
        selections={backgroundColorSelection}
      />

      <ItemSelectInput
        title="Item Filters"
        formName="itemFilters"
        selectedItems={selectedItems}
        valueName="Filter"
        blockMasterOption={selectedBlockOptions?.itemFilters}
        defaultValues={defaultValues?.itemFilters}
        selections={filterSelectValues}
      />

      <ItemInput
        title="Item Titles"
        formName="itemTitles"
        selectedItems={selectedItems}
        valueName="Title"
        blockMasterOption={selectedBlockOptions?.itemTitles}
        defaultValues={defaultValues?.itemTitles}
      />

      <ItemSelectInput
        title="Item Title Colors"
        formName="itemTitleColors"
        selectedItems={selectedItems}
        valueName="Title Color"
        blockMasterOption={selectedBlockOptions?.itemTitleColors}
        defaultValues={defaultValues?.itemTitleColors}
        selections={textColorSelection}
      />

      <ItemInput
        title="Item Links"
        formName="itemLinks"
        selectedItems={selectedItems}
        valueName="Link"
        blockMasterOption={selectedBlockOptions?.itemLinks}
        defaultValues={defaultValues?.itemLinks}
      />
    </>
  );
};

export default ItemOptions;
