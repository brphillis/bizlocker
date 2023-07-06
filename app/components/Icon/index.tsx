import type { IconType } from "react-icons";
import * as IconsIO5 from "react-icons/io5";

type IconProps = {
  iconName: keyof typeof IconsIO5;
  size: number;
  styles: string;
};

const Icon: React.FC<IconProps> = ({ iconName, size, styles }) => {
  let IconComponent = IconsIO5[iconName] as IconType;

  return IconComponent ? (
    <IconComponent size={size} className={styles} />
  ) : null;
};

export default Icon;
