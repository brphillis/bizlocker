import type { BlockOptions } from "@prisma/client";
import type { BlockName } from "~/utility/blockMaster/types";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";
import {
  returnCorrectSortByValues,
  sortOrderSelectValues,
} from "../../Values/sort";
import BlockSelectInput from "../../FieldComponents/Blocks/BlockSelectInput";

type Props = {
  selectedBlock?: BlockName;
  defaultValues?: BlockOptions;
  selectedBlockOptions?: BlockMasterOptions;
};

const SortAndOrderOptions = ({
  selectedBlock,
  defaultValues,
  selectedBlockOptions,
}: Props) => {
  return (
    <details className="bg-brand-white/20 collapse collapse-plus !hidden !max-w-full !rounded-sm [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium text-brand-white">
        Sort & Order
      </summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        {selectedBlock && (
          <BlockSelectInput
            valueName="Sort By"
            formName="sortBy"
            blockMasterOption={selectedBlockOptions?.sortBy}
            defaultValue={defaultValues?.sortBy}
            selections={returnCorrectSortByValues(selectedBlock)}
          />
        )}

        <BlockSelectInput
          valueName="Sort Order"
          formName="sortOrder"
          blockMasterOption={selectedBlockOptions?.sortOrder}
          defaultValue={defaultValues?.sortOrder}
          selections={sortOrderSelectValues}
        />
      </div>
    </details>
  );
};

export default SortAndOrderOptions;
