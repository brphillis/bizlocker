import { useState } from "react";
import ColorPickerInput from "./ColorPickerInput";
import ColorPickerPopup from "./ColorPickerPopup";

type Props = {
  id?: string;
  label: string;
  formName: string;
  defaultValue?: string;
  tooltip?: string;
  type?: "bg" | "text" | "border" | "outline" | "decoration";
  extendStyle?: string;
  onChange?: (e: string) => void;
};

const ColorPicker = ({
  id,
  label,
  formName,
  defaultValue,
  tooltip,
  type,
  extendStyle,
  onChange,
}: Props) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    defaultValue,
  );

  return (
    <>
      <ColorPickerInput
        label={label}
        tooltip={tooltip}
        inputBackgroundColor={selectedValue}
        inputOnClick={() => setEditing(true)}
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

            if (onChange && selectedColor) {
              onChange(selectedColor);
            }
          }}
        />
      )}

      <input
        id={id}
        hidden
        readOnly
        name={formName}
        value={selectedValue || ""}
      />
    </>
  );
};

export default ColorPicker;
