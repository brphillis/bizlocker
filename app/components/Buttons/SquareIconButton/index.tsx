import type * as IconsIO5 from "react-icons/io5";
import Icon from "~/components/Icon";

type Props = {
  iconName: keyof typeof IconsIO5;
  size: "small" | "medium" | "large";
  color: "primary" | "error";
  onClickFunction?: () => void;
  name?: string;
  type?: "button" | "submit" | "reset";
  value?: string;
};

const SquareIconButton = ({
  iconName,
  size,
  color,
  onClickFunction,
  name,
  type,
  value,
}: Props) => {
  let sizing: { style: string; size: number } | null = null;
  let coloring: string = "";

  switch (size) {
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
      coloring = "bg-primary hover:bg-primary-focus";
      break;

    case "error":
      coloring = "bg-error hover:bg-red-500";
      break;
  }

  return (
    <button
      className={`flex items-center justify-center !rounded-sm bg-error ${coloring} ${sizing?.style}`}
      onClick={() => {
        onClickFunction && onClickFunction();
      }}
      name={name || ""}
      type={type || "button"}
      value={value || ""}
    >
      <Icon iconName={iconName} size={14} styles="text-brand-white" />
    </button>
  );
};

export default SquareIconButton;
