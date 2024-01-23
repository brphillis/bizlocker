import type * as IconsIO5 from "react-icons/io5";
import Icon from "~/components/Icon";

type Props = {
  color: "primary" | "error";
  extendStyle?: string;
  iconName: keyof typeof IconsIO5;
  name?: string;
  onClick?: () => void;
  size: "xsmall" | "small" | "medium" | "large";
  type?: "button" | "submit" | "reset";
  value?: string;
};

const SquareIconButton = ({
  iconName,
  size,
  color,
  onClick,
  name,
  type,
  value,
  extendStyle,
}: Props) => {
  let sizing: { style: string; size: number } | null = null;
  let coloring: string = "";

  switch (size) {
    case "xsmall":
      sizing = {
        style: "!h-[24px] !min-h-[24px] !w-[24px] !min-w-[24px]",
        size: 14,
      };
      break;

    case "small":
      sizing = {
        style: "!h-[32px] !min-h-[32px] !w-[32px] !min-w-[32px]",
        size: 14,
      };
      break;

    case "medium":
      sizing = {
        style: "!h-[42px] !min-h-[42px] !w-[42px] !min-w-[42px]",
        size: 18,
      };
      break;

    case "large":
      sizing = {
        style: "!h-[52px] !min-h-[52px] !w-[52px] !min-w-[52px]",
        size: 22,
      };
      break;
  }

  switch (color) {
    case "primary":
      coloring = "bg-primary hover:bg-primary-dark";
      break;

    case "error":
      coloring = "bg-error hover:bg-red-500";
      break;
  }

  return (
    <button
      className={`flex items-center justify-center !rounded-sm bg-error ${coloring} ${sizing?.style} ${extendStyle}`}
      onClick={() => {
        onClick && onClick();
      }}
      name={name || ""}
      type={type || "button"}
      value={value || ""}
    >
      <Icon iconName={iconName} size={14} extendStyle="text-brand-white" />
    </button>
  );
};

export default SquareIconButton;
