import type { BlockOptions } from "@prisma/client";
import type { BlockName } from "~/utility/blockMaster/types";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";
import {
  returnCorrectSortByValues,
  sortOrderSelectValues,
} from "../../Values/sort";
import BlockSelectInput from "../_FieldComponents/BlockSelectInput";

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
    <details className="collapse collapse-plus !hidden !max-w-[100vw] max-md:!w-[100dvw] !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium text-brand-white">
        Sort & Order
      </summary>
      <div className="flex gap-3 flex-wrap items-start justify-start w-full px-3 pb-6 max-md:pb-3">
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
