import { useState } from "react";
import { handleBlockOptionItemInputChange } from "~/helpers/blockOptionHelpers";

type Props = {
  blockMasterOption?: boolean;
  defaultValues?: string[] | number[];
  formName: string;
  max?: string;
  selectedItems: PageBuilderContentSelection[];
  title: string;
  type?: "string" | "number";
  valueName: string;
};

const ItemInput = ({
  blockMasterOption,
  defaultValues,
  formName,
  max,
  selectedItems,
  title,
  type = "string",
  valueName,
}: Props) => {
  const [items, setItems] = useState<(string | number | undefined)[]>(
    defaultValues || [],
  );

  return (
    <details className="collapse collapse-plus !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid max-md:px-3">
      <summary className="collapse-title text-xl font-medium text-brand-white">
        {title}
      </summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        {selectedItems.map((_, i) => {
          const relativeIndex = i + 1;

          const dynamicDefault = defaultValues?.[i];

          if (blockMasterOption) {
            return (
              <div
                key={`${valueName}Options_Item${valueName}_` + i}
                className="form-control w-[215px] max-md:w-full max-md:items-center"
              >
                <label className="label self-start max-md:ml-3">
                  <span className="label-text text-brand-white">
                    {"Item " + relativeIndex.toString() + " " + valueName}
                  </span>
                </label>
                <input
                  type={type}
                  step={type === "number" ? "any" : undefined}
                  max={max ? max : undefined}
                  className="input input-bordered w-[95vw] max-w-full text-brand-black sm:w-[215px]"
                  placeholder="None"
                  defaultValue={dynamicDefault ? dynamicDefault : undefined}
                  onChange={(e) =>
                    handleBlockOptionItemInputChange(
                      i,
                      e.target.value,
                      items,
                      setItems,
                    )
                  }
                />
              </div>
            );
          } else return null;
        })}
      </div>

      {blockMasterOption && items && (
        <input hidden readOnly name={formName} value={JSON.stringify(items)} />
      )}
    </details>
  );
};

export default ItemInput;
