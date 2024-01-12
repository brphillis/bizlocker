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
  const contentId = searchParams.get("contentId") || searchParams.get("id");

  let mode = contentId === "add" ? "add" : "edit";

  const handleActiveStatus = (mode: string): boolean => {
    if (mode === "add") {
      return true;
    }
    if (isActive) {
      return true;
    } else return false;
  };

  return (
    <BasicToggle
      label="Active"
      name="isActive"
      size={size || "md"}
      defaultValue={handleActiveStatus(mode)}
      labelStyle={labelStyle}
      extendStyle={extendStyle}
      style={style}
    />
  );
};

export default IsActiveToggle;
