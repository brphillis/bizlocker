import { useState } from "react";
import { handleBlockOptionItemInputChange } from "~/helpers/blockOptionHelpers";

type Props = {
  title: string;
  valueName: string;
  formName: string;
  defaultValues?: string[];
  blockMasterOption?: boolean;
  selectedItems: ContentSelection[];
  tooltip?: string;
  type?: "string" | "number";
  max?: string;
};

const ItemInput = ({
  title,
  valueName,
  formName,
  defaultValues,
  blockMasterOption,
  selectedItems,
  tooltip,
  type = "string",
  max,
}: Props) => {
  const [items, setItems] = useState<string[]>(defaultValues || []);

  return (
    <details className="collapse !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">{title}</summary>
      <div className="flex max-w-full flex-wrap justify-center !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        {selectedItems.map((_, i) => {
          const relativeIndex = i + 1;

          const dynamicDefault = defaultValues?.[i];

          if (blockMasterOption) {
            return (
              <div
                key={`${valueName}Options_Item${valueName}_` + i}
                className="form-control max-w-[215px] max-sm:items-center"
              >
                <label className="label self-start">
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
                      setItems
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
