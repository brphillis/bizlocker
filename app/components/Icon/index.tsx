import type { IconType } from "react-icons";
import * as IconsIO5 from "react-icons/io5";

type IconProps = {
  iconName: keyof typeof IconsIO5;
  size: number;
  styles: string;
  color?: string;
};

const Icon = ({ iconName, size, styles, color }: IconProps) => {
  let IconComponent = IconsIO5[iconName] as IconType;
  if (color) {
    return IconComponent ? (
      <IconComponent size={size} className={styles} color={color} />
    ) : null;
  } else {
    return IconComponent ? (
      <IconComponent size={size} className={styles} />
    ) : null;
  }
};

export default Icon;
