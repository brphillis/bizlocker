import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";

import BlockInput from "../../Components/BlockInput";

type Props = {
  defaultValues?: BlockOptions;
  selectedBlockOptions?: BlockMasterOptions;
};

const ColumnsAndRowsOptions = ({
  defaultValues,
  selectedBlockOptions,
}: Props) => {
  return (
    <details className="collapse !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">
        Columns & Rows
      </summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        <BlockInput
          valueName="Columns"
          formName="columns"
          blockMasterOption={selectedBlockOptions?.columns}
          defaultValue={defaultValues?.columns}
          type="number"
        />

        <BlockInput
          valueName="Columns Mobile"
          formName="columnsMobile"
          blockMasterOption={selectedBlockOptions?.columnsMobile}
          defaultValue={defaultValues?.columnsMobile}
          type="number"
        />

        <BlockInput
          valueName="Rows"
          formName="rows"
          blockMasterOption={selectedBlockOptions?.rows}
          defaultValue={defaultValues?.rows}
          type="number"
        />
      </div>
    </details>
  );
};

export default ColumnsAndRowsOptions;
