import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";
import BlockInput from "../_FieldComponents/BlockInput";
import BlockSelectInput from "../_FieldComponents/BlockSelectInput";
import {
  columnMobileSelectValues,
  columnSelectValues,
} from "../../Values/basic";

type Props = {
  defaultValues?: BlockOptions;
  selectedBlockOptions?: BlockMasterOptions;
};

const ColumnsAndRowsOptions = ({
  defaultValues,
  selectedBlockOptions,
}: Props) => {
  return (
    <details className="collapse collapse-plus !hidden !max-w-[100vw] max-md:!w-[100dvw] !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium text-brand-white">
        Columns & Rows
      </summary>
      <div className="flex gap-3 flex-wrap items-start justify-start w-full px-3 pb-6 max-md:pb-3">
        <BlockSelectInput
          valueName="Columns"
          formName="columns"
          blockMasterOption={selectedBlockOptions?.columns}
          defaultValue={defaultValues?.columns}
          selections={columnSelectValues}
        />

        <BlockSelectInput
          valueName="Columns Mobile"
          formName="columnsMobile"
          blockMasterOption={selectedBlockOptions?.columnsMobile}
          defaultValue={defaultValues?.columnsMobile}
          selections={columnMobileSelectValues}
        />

        <BlockInput
          valueName="Columns"
          formName="numberColumns"
          blockMasterOption={selectedBlockOptions?.numberColumns}
          defaultValue={defaultValues?.numberColumns}
          type="number"
        />

        <BlockInput
          valueName="Columns Mobile"
          formName="numberColumnsMobile"
          blockMasterOption={selectedBlockOptions?.numberColumnsMobile}
          defaultValue={defaultValues?.numberColumnsMobile}
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
