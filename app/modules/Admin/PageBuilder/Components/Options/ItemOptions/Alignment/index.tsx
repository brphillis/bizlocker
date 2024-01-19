import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/types";
import {
  alignSelectMobileValues,
  alignSelectValues,
  justifySelectMobileValues,
  justifySelectValues,
  objectPositionMobileSelectValues,
  objectPositionSelectValues,
} from "../../Values/position";
import ItemSelectInput from "../_FieldComponents/ItemSelectInput";

type Props = {
  selectedItems: ContentSelection[];
  defaultValues?: BlockOptions;
  selectedBlockOptions: BlockMasterOptions | undefined;
};

const Alignment = ({
  selectedItems,
  defaultValues,
  selectedBlockOptions,
}: Props) => {
  return (
    <details className="collapse collapse-plus !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium text-brand-white">
        Alignment
      </summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        <ItemSelectInput
          title="X Axis"
          formName="itemJustify"
          selectedItems={selectedItems}
          valueName="X Axis"
          blockMasterOption={selectedBlockOptions?.itemJustify}
          defaultValues={defaultValues?.itemJustify}
          selections={justifySelectValues}
        />

        <ItemSelectInput
          title="Y Axis"
          formName="itemAlign"
          selectedItems={selectedItems}
          valueName="Y Axis"
          blockMasterOption={selectedBlockOptions?.itemAlign}
          defaultValues={defaultValues?.itemAlign}
          selections={alignSelectValues}
        />

        <ItemSelectInput
          title="X Axis Mobile"
          formName="itemJustifyMobile"
          selectedItems={selectedItems}
          valueName="X Axis Mobile"
          blockMasterOption={selectedBlockOptions?.itemJustifyMobile}
          defaultValues={defaultValues?.itemJustifyMobile}
          selections={justifySelectMobileValues}
        />

        <ItemSelectInput
          title="Y Axis Mobile"
          formName="itemAlignMobile"
          selectedItems={selectedItems}
          valueName="Y Axis Mobile"
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
  );
};

export default Alignment;
