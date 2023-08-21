import Icon from "~/components/Icon";
import type * as IconsIO5 from "react-icons/io5";

type BlockIconProps = {
  blockName?: string;
  size: number;
  styles: string;
};

const BlockIcon = ({ blockName, size, styles }: BlockIconProps) => {
  let iconName: keyof typeof IconsIO5 = "IoSquare";

  switch (blockName) {
    case "banner":
      iconName = "IoTabletLandscape";
      break;
    case "tile":
      iconName = "IoGrid";
      break;
    case "text":
      iconName = "IoText";
      break;
    case "product":
      iconName = "IoCart";
      break;
    case "article":
      iconName = "IoNewspaper";
      break;
    default:
      break;
  }

  return <Icon iconName={iconName} size={size} styles={styles} />;
};

export default BlockIcon;
