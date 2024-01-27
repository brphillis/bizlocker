import React, { useState } from "react";
import ColorPickerInput from "~/components/Forms/ColorPicker/ColorPickerInput";
import ColorPickerPopup from "~/components/Forms/ColorPicker/ColorPickerPopup";
import { handleBlockOptionItemInputChange } from "~/helpers/blockOptionHelpers";

type Props = {
  title: string;
  valueName: string;
  formName: string;
  defaultValues?: string[];
  blockMasterOption?: boolean;
  selectedItems: PageBuilderContentSelection[];
  type?: "bg" | "text" | "border" | "outline" | "decoration";
};

const ItemColorInput = ({
  title,
  valueName,
  formName,
  defaultValues,
  blockMasterOption,
  selectedItems,
  type,
}: Props) => {
  const [items, setItems] = useState<(string | number | undefined)[]>(
    defaultValues || [],
  );
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [valuesEdited, setValuesEdited] = useState<boolean>(false);

  return (
    <details className="collapse collapse-plus !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid px-0 max-md:px-3">
      <summary className="collapse-title text-xl font-medium text-brand-white">
        {title}
      </summary>
      <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
        {selectedItems.map((_, index) => {
          const relativeIndex = index + 1;

          if (blockMasterOption) {
            return (
              <React.Fragment
                key={`${formName}_Options_Item_${valueName}_` + index}
              >
                <ColorPickerInput
                  label={"Item " + relativeIndex.toString() + " " + valueName}
                  inputBackgroundColor={
                    !valuesEdited
                      ? items[index]?.toString() ||
                        defaultValues?.[index]?.toString()
                      : items[index]?.toString()
                  }
                  inputOnClick={() => setEditingItem(relativeIndex)}
                />

                {editingItem && (
                  <ColorPickerPopup
                    type={type}
                    defaultValue={items?.[editingItem - 1]?.toString()}
                    closeFunction={() => setEditingItem(null)}
                    selectFunction={(selectedColor) => {
                      handleBlockOptionItemInputChange(
                        editingItem - 1,
                        selectedColor,
                        items,
                        setItems,
                      );
                      setValuesEdited(true);
                      setEditingItem(null);
                    }}
                  />
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
