import { useState } from "react";
import ColorPickerInput from "~/components/Forms/ColorPicker/ColorPickerInput";
import ColorPickerPopup from "~/components/Forms/ColorPicker/ColorPickerPopup";
type Props = {
  valueName: string;
  formName: string;
  defaultValue?: string | null;
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
    defaultValue || undefined
  );
  const [editing, setEditing] = useState<boolean>(false);

  return (
    <>
      {blockMasterOption && (
        <div className="px-3">
          <ColorPickerInput
            label={valueName}
            tooltip={tooltip}
            inputBackgroundColor={selectedValue || defaultValue}
            inputOnClick={() => setEditing(true)}
          />
        </div>
      )}

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

export default BlockColorInput;
