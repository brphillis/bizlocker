import { useState } from "react";
import { handleBlockOptionItemInputChange } from "~/helpers/blockOptionHelpers";

type Props = {
  title: string;
  valueName: string;
  formName: string;
  defaultValues?: string[];
  blockMasterOption?: boolean;
  selectedItems: ContentSelection[];
  selections: Array<SelectValue> | null;
};

const ItemSelectInput = ({
  title,
  valueName,
  formName,
  defaultValues,
  blockMasterOption,
  selectedItems,
  selections,
}: Props) => {
  const [items, setItems] = useState<string[]>(defaultValues || []);

  return (
    <details className="collapse collapse-plus !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">{title}</summary>
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
                <label className="label max-md:ml-3 max-md:!self-start">
                  <span className="label-text text-brand-white">
                    {"Item " + relativeIndex.toString() + " " + valueName}
                  </span>
                </label>

                <select
                  className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
                  defaultValue={dynamicDefault ? dynamicDefault : undefined}
                  onChange={(e) =>
                    handleBlockOptionItemInputChange(
                      i,
                      e.target.value,
                      items,
                      setItems
                    )
                  }
                >
                  <option value="">None</option>
                  {selections?.map(
                    ({ id, name }: SelectValue, index: number) => (
                      <option
                        key={`multipleItemSelect_${name}_${id}_${index}`}
                        value={id}
                      >
                        {name}
                      </option>
                    )
                  )}
                </select>
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

export default ItemSelectInput;
