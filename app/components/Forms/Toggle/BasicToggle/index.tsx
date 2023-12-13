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

const BasicToggle = ({
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

  let toggleSize;

  switch (size) {
    case "xs":
      toggleSize = "toggle-xs";
      break;
    case "sm":
      toggleSize = "toggle-sm";
      break;
    case "md":
      toggleSize = "toggle-md";
      break;
    case "lg":
      toggleSize = "toggle-lg";
      break;
    default:
      toggleSize = "toggle-md";
  }

  let toggleStyle;

  switch (style) {
    case "success":
      toggleStyle = "toggle-success";
      break;
    case "warning":
      toggleStyle = "toggle-warning";
      break;
    case "info":
      toggleStyle = "toggle-info";
      break;
    case "error":
      toggleStyle = "toggle-error";
      break;
    default:
      toggleStyle = "toggle-success";
  }

  return (
    <>
      <label
        className={`label relative max-w-max cursor-pointer ${extendStyle}`}
      >
        <input
          type="checkbox"
          className={`toggle ${toggleSize} ${toggleStyle}`}
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

export default BasicToggle;
