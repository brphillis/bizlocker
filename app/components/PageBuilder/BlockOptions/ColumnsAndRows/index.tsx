import type { BlockOptions } from "@prisma/client";
import type { BlockMasterOptions } from "~/utility/blockMaster";

type Props = {
  defaultValues?: BlockOptions;
  selectedBlockOptions?: BlockMasterOptions;
};

const ColumnsAndRowsOptions = ({
  defaultValues,
  selectedBlockOptions,
}: Props) => {
  const { columns, columnsMobile, rows } = defaultValues || {};

  return (
    <details className="collapse !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">
        Columns & Rows
      </summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        {selectedBlockOptions?.columns && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Columns</span>
            </label>
            <input
              name="columns"
              type="number"
              className="input input-bordered w-[95vw] max-w-full text-brand-black sm:w-[215px]"
              placeholder="Columns"
              defaultValue={columns || undefined}
            />
          </div>
        )}

        {selectedBlockOptions?.columnsMobile && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">
                Columns Mobile
              </span>
            </label>
            <input
              name="columnsMobile"
              type="number"
              className="input input-bordered w-[95vw] max-w-full text-brand-black sm:w-[215px]"
              placeholder="Columns"
              defaultValue={columnsMobile || undefined}
            />
          </div>
        )}

        {selectedBlockOptions?.rows && (
          <div className="form-control max-sm:items-center">
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Rows</span>
            </label>
            <input
              name="rows"
              type="number"
              className="input input-bordered w-[95vw] max-w-full text-brand-black sm:w-[215px]"
              placeholder="Rows"
              defaultValue={rows || undefined}
            />
          </div>
        )}
      </div>
    </details>
  );
};

export default ColumnsAndRowsOptions;
