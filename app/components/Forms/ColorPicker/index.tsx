import { useState } from "react";
import ColorPickerInput from "./ColorPickerInput";
import ColorPickerPopup from "./ColorPickerPopup";

type Props = {
  label: string;
  formName: string;
  defaultValue?: string;
  tooltip?: string;
  type?: "bg" | "text" | "border" | "outline" | "decoration";
  customWidth?: string;
  extendStyle?: string;
};

const ColorPicker = ({
  label,
  formName,
  defaultValue,
  tooltip,
  type,
  customWidth,
  extendStyle,
}: Props) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    defaultValue
  );

  return (
    <>
      <ColorPickerInput
        label={label}
        tooltip={tooltip}
        inputBackgroundColor={selectedValue}
        inputOnClick={() => setEditing(true)}
        customWidth={customWidth}
        extendStyle={extendStyle}
      />

      {editing && (
        <ColorPickerPopup
          type={type}
          defaultValue={selectedValue}
          closeFunction={() => setEditing(false)}
          selectFunction={(selectedColor) => {
            setSelectedValue(selectedColor);
            setEditing(false);
          }}
        />
      )}

      <input hidden readOnly name={formName} value={selectedValue || ""} />
    </>
  );
};

export default ColorPicker;
