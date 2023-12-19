import { useState } from "react";
import ColorPickerInput from "~/components/Forms/ColorPicker/ColorPickerInput";
import ColorPickerPopup from "~/components/Forms/ColorPicker/ColorPickerPopup";
type Props = {
  valueName: string;
  formName: string;
  defaultValue?: string;
  blockMasterOption?: boolean;
  tooltip?: string;
  type?: "bg" | "text" | "border" | "outline" | "decoration";
};

const BlockColorInput = ({
  valueName,
  formName,
  defaultValue,
  blockMasterOption,
  tooltip,
  type,
}: Props) => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    defaultValue
  );
  const [editing, setEditing] = useState<boolean>(false);

  return (
    <>
      {blockMasterOption && (
        <div className="px-3 max-md:w-full max-md:px-0">
          <ColorPickerInput
            label={valueName}
            tooltip={tooltip}
            inputBackgroundColor={selectedValue || defaultValue}
            inputOnClick={() => setEditing(true)}
          />

          {editing && (
            <ColorPickerPopup
              closeFunction={() => setEditing(false)}
              selectFunction={(selectedColor) => {
                setSelectedValue(
                  selectedColor
                    ? type
                      ? type + "-" + selectedColor
                      : selectedColor
                    : undefined
                );
                setEditing(false);
              }}
              type={type}
            />
          )}

          <input hidden readOnly name={formName} value={selectedValue || ""} />
        </div>
      )}
    </>
  );
};

export default BlockColorInput;
