import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/types";
import { filterSelectValues } from "../../Values/filters";
import ItemSelectInput from "../_FieldComponents/ItemSelectInput";

type Props = {
  selectedItems: ContentSelection[];
  defaultValues?: BlockOptions;
  selectedBlockOptions: BlockMasterOptions | undefined;
};

const Effects = ({
  selectedItems,
  defaultValues,
  selectedBlockOptions,
}: Props) => {
  return (
    <details className="collapse collapse-plus !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium text-brand-white">
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
  );
};

export default Effects;
