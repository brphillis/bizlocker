import React from "react";
import Icon from "~/components/Icon";

type BlockIconProps = {
  blockName?: string;
  size: number;
  styles: string;
};

const BlockIcon: React.FC<BlockIconProps> = ({ blockName, size, styles }) => {
  if (blockName === "banner") {
    return <Icon iconName="IoTabletLandscape" size={size} styles={styles} />;
  }

  if (blockName === "tile") {
    return <Icon iconName="IoGrid" size={size} styles={styles} />;
  } else {
    return <Icon iconName="IoSquare" size={size} styles={styles} />;
  }
};

export default BlockIcon;
