import type { IconType } from "react-icons";
import * as IconsIO5 from "react-icons/io5";

type IconProps = {
  iconName: keyof typeof IconsIO5;
  size: number;
  extendStyle?: string;
  onClick?: () => void;
  type?: "button" | "reset" | "submit";
};

const IconButton = ({
  iconName,
  size,
  extendStyle,
  onClick,
  type = "button",
}: IconProps) => {
  // eslint-disable-next-line
  let IconComponent = IconsIO5[iconName] as IconType;
  return IconComponent ? (
    <button
      type={type}
      className={extendStyle}
      onClick={() => onClick && onClick()}
    >
      <IconComponent size={size} />
    </button>
  ) : null;
};

export default IconButton;
