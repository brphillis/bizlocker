import { useState } from "react";
type Props = {
  defaultValue: boolean;
  label?: string;
  labelStyle?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg";
  style?: "success" | "warning" | "info" | "error";
  extendStyle?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const BasicCheckbox = ({
  name,
  size,
  style,
  extendStyle,
  defaultValue,
  label,
  labelStyle,
  onChange,
}: Props) => {
  const [isActive, setIsActive] = useState<boolean>(defaultValue);

  let checkboxSize;

  switch (size) {
    case "xs":
      checkboxSize = "checkbox-xs";
      break;
    case "sm":
      checkboxSize = "checkbox-sm";
      break;
    case "md":
      checkboxSize = "checkbox-md";
      break;
    case "lg":
      checkboxSize = "checkbox-lg";
      break;
    default:
      checkboxSize = "checkbox-md";
  }

  let checkboxStyle;

  switch (style) {
    case "success":
      checkboxStyle = "checkbox-success";
      break;
    case "warning":
      checkboxStyle = "checkbox-warning";
      break;
    case "info":
      checkboxStyle = "checkbox-info";
      break;
    case "error":
      checkboxStyle = "checkbox-error";
      break;
    default:
      checkboxStyle = "checkbox-success";
  }

  return (
    <>
      <label
        className={`label relative max-w-max cursor-pointer ${extendStyle}`}
      >
        <input
          type="checkbox"
          className={`checkbox ${checkboxSize} ${checkboxStyle}`}
          checked={isActive ? true : false}
          onChange={(e) => {
            setIsActive(e.target.checked ? true : false);
            onChange && onChange(e);
          }}
        />
        {label && (
          <span className={`label-text ml-3 ${labelStyle}`}>{label}</span>
        )}
      </label>
      {isActive && name && (
        <input name={name} value={isActive ? "true" : ""} readOnly hidden />
      )}
    </>
  );
};

export default BasicCheckbox;
