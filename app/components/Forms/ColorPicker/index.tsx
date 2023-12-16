import { useState } from "react";
import ColorPickerInput from "./ColorPickerInput";
import ColorPickerPopup from "./ColorPickerPopup";

type Props = {
  label: string;
  formName: string;
  defaultValue?: string | null;
  tooltip?: string;
  type?: "bg" | "text" | "border" | "outline" | "decoration";
  customWidth?: string;
};

const ColorPicker = ({
  label,
  formName,
  defaultValue,
  tooltip,
  type,
  customWidth,
}: Props) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    defaultValue || undefined
  );

  return (
    <>
      <ColorPickerInput
        label={label}
        tooltip={tooltip}
        inputBackgroundColor={selectedValue || defaultValue}
        inputOnClick={() => setEditing(true)}
        customWidth={customWidth}
      />

      {editing && (
        <ColorPickerPopup
          closeFunction={() => setEditing(false)}
          selectFunction={(selectedColor) => {
            setSelectedValue(type ? type + "-" + selectedColor : selectedColor);
            setEditing(false);
          }}
          type={type}
        />
      )}

      <input hidden readOnly name={formName} value={selectedValue} />
    </>
  );
};

export default ColorPicker;
