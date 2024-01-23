import BasicToggle from "../BasicToggle";
import { useSearchParams } from "@remix-run/react";

type Props = {
  id?: string;
  isActive?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  style?: "success" | "warning" | "info" | "error";
  labelStyle?: string;
  extendStyle?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const IsActiveToggle = ({
  id,
  isActive,
  size,
  style,
  labelStyle,
  extendStyle,
  onChange,
}: Props) => {
  const [searchParams] = useSearchParams();
  const contentId = searchParams.get("contentId") || searchParams.get("id");

  const mode = contentId === "add" ? "add" : "edit";

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
      id={id}
      label="Active"
      name="isActive"
      size={size || "md"}
      defaultValue={handleActiveStatus(mode)}
      labelStyle={labelStyle}
      extendStyle={extendStyle}
      style={style}
      onChange={(e) => onChange && onChange(e)}
    />
  );
};

export default IsActiveToggle;
