import type { BlockOptions } from "@prisma/client";

import ToolTip from "~/components/Indicators/ToolTip";

type Props = {
  defaultValues?: BlockOptions;
  selectedBlockOptions?: BlockMasterOptions;
};

const MarginAndPaddingOptions = ({
  defaultValues,
  selectedBlockOptions,
}: Props) => {
  const { margin, padding } = defaultValues || {};

  return (
    <details className="collapse !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">
        Margin & Padding
      </summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        {selectedBlockOptions?.margin && (
          <div className="form-control relative max-sm:items-center">
            <ToolTip tip="Padding is the area between the item and another item" />
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Margin</span>
            </label>
            <select
              name="margin"
              className=" select w-[95vw] max-w-full text-brand-black/75 sm:w-[215px]"
              placeholder="Customize Margin"
              defaultValue={!margin ? undefined : margin}
            >
              <option value={undefined}>Normal Margin</option>
              <option value=" max-md:!-mt-[13px] !-mt-6">No Top</option>
              <option value=" max-md:-mt-[13px]">No Top Mobile</option>
              <option value=" md:!-mt-6">No Top Desktop</option>

              <option value=" max-md:!-mb-[13px] !-mb-6">No Bottom</option>
              <option value=" max-md:-mb-[13px]">No Bottom Mobile</option>
              <option value=" md:!-mb-6">No Bottom Desktop</option>

              <option value=" max-md:!-my-[13px] !-my-6">No Y</option>
              <option value=" max-md:-my-[13px]">No Y Mobile</option>
              <option value=" md:!-my-6">No Y Desktop</option>

              <option value=" max-md:!-mx-3 !-mx-6">No X</option>
              <option value=" max-md:-mx-3">No X Mobile</option>
              <option value=" md:!-mx-6">No X Desktop</option>
            </select>
          </div>
        )}

        {selectedBlockOptions?.padding && (
          <div className="form-control relative max-sm:items-center">
            <ToolTip tip="Padding is the area between the margin & the item" />
            <label className="label max-sm:ml-3 max-sm:!self-start">
              <span className="label-text text-brand-white">Padding</span>
            </label>
            <select
              name="padding"
              className=" select w-[95vw] max-w-full text-brand-black/75 sm:w-[215px]"
              placeholder="Customize Padding"
              defaultValue={!padding ? undefined : padding}
            >
              <option value={undefined}>Normal Padding</option>

              <option value=" !pt-0">No Top</option>
              <option value=" max-md:!pt-0">No Top Mobile</option>
              <option value=" md:!pt-0">No Top Desktop</option>

              <option value=" !pb-0">No Bottom</option>
              <option value=" max-md:!pb-0">No Bottom Mobile</option>
              <option value=" md:!pb-0">No Bottom Desktop</option>

              <option value=" !py-0">No Y</option>
              <option value=" max-md:!py-0">No Y Mobile</option>
              <option value=" md:!py-0">No Y Desktop</option>

              <option value=" !px-0">No X</option>
              <option value=" max-md:!px-0">No X Mobile</option>
              <option value=" md:!px-0">No X Desktop</option>
            </select>
          </div>
        )}
      </div>
    </details>
  );
};

export default MarginAndPaddingOptions;
