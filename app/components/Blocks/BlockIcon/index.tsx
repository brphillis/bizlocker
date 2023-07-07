import Icon from "~/components/Icon";

type BlockIconProps = {
  blockName?: string;
  size: number;
  styles: string;
};

const BlockIcon = ({ blockName, size, styles }: BlockIconProps) => {
  if (blockName === "banner") {
    return <Icon iconName="IoTabletLandscape" size={size} styles={styles} />;
  }

  if (blockName === "tile") {
    return <Icon iconName="IoGrid" size={size} styles={styles} />;
  }

  if (blockName === "text") {
    return <Icon iconName="IoText" size={size} styles={styles} />;
  } else {
    return <Icon iconName="IoSquare" size={size} styles={styles} />;
  }
};

export default BlockIcon;
