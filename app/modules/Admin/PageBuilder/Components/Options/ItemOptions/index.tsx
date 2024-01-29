import type { BlockMasterOptions } from "~/utility/blockMaster/types";
import type { BlockOptions } from "@prisma/client";
import Alignment from "./Alignment";
import Borders from "./Borders";
import Backgrounds from "./Backgrounds";
import Buttons from "./Buttons";
import Colors from "./Colors";
import Effects from "./Effects";
import Links from "./Links";
import Text from "./Text";
import Titles from "./Titles";
import PaddingAndPadding from "./MarginAndPadding";

type Props = {
  selectedItems: PageBuilderContentSelection[];
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
      <Alignment
        selectedItems={selectedItems}
        selectedBlockOptions={selectedBlockOptions}
        defaultValues={defaultValues}
      />

      <Backgrounds
        selectedItems={selectedItems}
        selectedBlockOptions={selectedBlockOptions}
        defaultValues={defaultValues}
      />

      <PaddingAndPadding
        selectedItems={selectedItems}
        selectedBlockOptions={selectedBlockOptions}
        defaultValues={defaultValues}
      />

      <Borders
        selectedItems={selectedItems}
        selectedBlockOptions={selectedBlockOptions}
        defaultValues={defaultValues}
      />

      <Buttons
        selectedItems={selectedItems}
        selectedBlockOptions={selectedBlockOptions}
        defaultValues={defaultValues}
      />

      <Colors
        selectedItems={selectedItems}
        selectedBlockOptions={selectedBlockOptions}
        defaultValues={defaultValues}
      />

      <Effects
        selectedItems={selectedItems}
        selectedBlockOptions={selectedBlockOptions}
        defaultValues={defaultValues}
      />

      <Links
        selectedItems={selectedItems}
        selectedBlockOptions={selectedBlockOptions}
        defaultValues={defaultValues}
      />

      <Titles
        selectedItems={selectedItems}
        selectedBlockOptions={selectedBlockOptions}
        defaultValues={defaultValues}
      />

      <Text
        selectedItems={selectedItems}
        selectedBlockOptions={selectedBlockOptions}
        defaultValues={defaultValues}
      />
    </>
  );
};

export default ItemOptions;
