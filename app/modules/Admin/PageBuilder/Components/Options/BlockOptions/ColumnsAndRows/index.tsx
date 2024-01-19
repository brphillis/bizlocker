import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster/blockMaster";
import BlockInput from "../_FieldComponents/BlockInput";

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
