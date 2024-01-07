import { useState } from "react";
import BasicToggle from "../BasicToggle";
import { useSearchParams } from "@remix-run/react";

type Props = {
  isActive?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  style?: "success" | "warning" | "info" | "error";
  labelStyle?: string;
  extendStyle?: string;
};

const IsActiveToggle = ({
  isActive,
  size,
  style,
  labelStyle,
  extendStyle,
}: Props) => {
  const [searchParams] = useSearchParams();
  const contentId = searchParams.get("contentId");

  let mode = contentId === "add" ? "add" : "edit";

  const handleActiveStatus = (mode: string): boolean => {
    if (mode === "add") {
      return true;
    }
    if (isActive) {
      return true;
    } else return false;
  };

  const [active, setActive] = useState<boolean>(handleActiveStatus(mode));

  return (
    <BasicToggle
      label="Active"
      name="isActive"
      size={size || "md"}
      value={active}
      labelStyle={labelStyle}
      extendStyle={extendStyle}
      style={style}
      onChange={() => {
        setActive(!active);
      }}
    />
  );
};

export default IsActiveToggle;
