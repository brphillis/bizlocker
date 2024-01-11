import { useState } from "react";

type Props = {
  id?: string;
  defaultValue: boolean;
  label?: string;
  labelStyle?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg";
  style?: "success" | "warning" | "info" | "error";
  extendStyle?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
};

const BasicToggle = ({
  id,
  name,
  size,
  style,
  extendStyle,
  defaultValue,
  label,
  labelStyle,
  onChange,
  onClick,
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
          onClick={(e) => {
            setIsActive(!isActive);
            onClick && onClick(e);
          }}
          onChange={(e) => {
            onChange && onChange(e);
          }}
        />
        {label && (
          <span className={`label-text ml-3 ${labelStyle}`}>{label}</span>
        )}
      </label>
      <input
        id={id}
        name={name}
        value={isActive ? "true" : ""}
        readOnly
        hidden
      />
    </>
  );
};

export default BasicToggle;
