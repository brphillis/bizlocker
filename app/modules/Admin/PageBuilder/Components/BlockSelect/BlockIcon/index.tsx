import Icon from "~/components/Icon";
import type * as IconsIO5 from "react-icons/io5";
import { blockMaster } from "~/utility/blockMaster/blockMaster";

type BlockIconProps = {
  blockName: string;
  size: number;
  extendStyle?: string;
};

const BlockIcon = ({ blockName, size, extendStyle }: BlockIconProps) => {
  const iconName = (blockMaster.find((e) => e.name === blockName)?.icon ||
    "IoSquare") as keyof typeof IconsIO5;

  return (
    <Icon iconName={iconName} size={size} extendStyle={extendStyle || ""} />
  );
};

export default BlockIcon;
