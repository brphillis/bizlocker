import { IoInformationCircle } from "react-icons/io5";

type Props = {
  tip: string;
  iconColor?: string;
  extendStyle?: string;
  direction?: "top" | "left" | "right" | "bottom";
};

const ToolTip = ({ tip, direction, iconColor, extendStyle }: Props) => {
  let currentDirection;

  switch (direction) {
    case "top":
      currentDirection = "tooltip-top";
      break;
    case "right":
      currentDirection = "tooltip-right";
      break;
    case "bottom":
      currentDirection = "tooltip-bottom";
      break;
    case "left":
      currentDirection = "tooltip-left";
      break;

    default:
      currentDirection = "tooltip-top";
      break;
  }

  return (
    <div
      className={`z-100 tooltip tooltip-primary absolute right-1 top-[12px] max-md:tooltip-left ${currentDirection} ${iconColor} ${extendStyle}`}
      data-tip={tip}
    >
      <IoInformationCircle />
    </div>
  );
};

export default ToolTip;
