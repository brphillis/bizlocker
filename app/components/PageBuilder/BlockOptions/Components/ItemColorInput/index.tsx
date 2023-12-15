import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { handleBlockOptionItemInputChange } from "~/helpers/blockOptionHelpers";
import { getThemeColorNames } from "~/utility/colors";

type Props = {
  title: string;
  valueName: string;
  formName: string;
  defaultValues?: string[];
  blockMasterOption?: boolean;
  selectedItems: ContentSelection[];
};

const ItemColorInput = ({
  title,
  valueName,
  formName,
  defaultValues,
  blockMasterOption,
  selectedItems,
}: Props) => {
  const [items, setItems] = useState<string[]>(defaultValues || []);
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const colors = getThemeColorNames();

  return (
    <details className="bg-brand-white/20 collapse collapse-plus !hidden !max-w-full !rounded-sm [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium">{title}</summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        {selectedItems.map((_, index) => {
          const relativeIndex = index + 1;

          if (blockMasterOption) {
            return (
              <React.Fragment
                key={`${formName}_Options_Item_${valueName}_` + index}
              >
                <div className="form-control w-[215px] max-md:w-full max-md:items-center">
                  <label className="label self-start max-md:ml-3">
                    <span className="text-brand-white label-text">
                      {"Item " + relativeIndex.toString() + " " + valueName}
                    </span>
                  </label>

                  <div
                    className={`border-brand-white/25 h-[42px] w-[95vw] cursor-pointer border-[1px] sm:w-[215px] 
                     ${items[index] || defaultValues?.[index]}`}
                    onClick={() => {
                      setEditingItem(relativeIndex);
                    }}
                  ></div>
                </div>

                {editingItem && (
                  <div className="fixed left-[50%] top-0 z-50 flex h-screen w-screen translate-x-[-50%] items-center justify-center bg-black/90">
                    <div className="bg-brand-black relative flex max-w-[400px] flex-wrap items-center justify-center gap-3 rounded-sm px-3 pb-6 pt-12">
                      <button
                        type="button"
                        className="absolute right-3 top-3 cursor-pointer"
                      >
                        <IoClose onClick={() => setEditingItem(null)} />
                      </button>

                      {colors.map((colorVal: string, nestedIndex: number) => {
                        return (
                          <div
                            key={
                              `${formName}_Options_ColorSelection_${valueName}_` +
                              (nestedIndex + 10000)
                            }
                            className={`border-brand-white h-6 w-6 cursor-pointer border-[1px] 
                            ${"bg-" + colorVal}`}
                            onClick={() => {
                              handleBlockOptionItemInputChange(
                                editingItem - 1,
                                "bg-" + colorVal,
                                items,
                                setItems
                              );
                              setEditingItem(null);
                            }}
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </React.Fragment>
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

export default ItemColorInput;
