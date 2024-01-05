import WindowTitleBar from "~/components/Layout/TitleBars/WindowTitleBar";

type Props = {
  label: string;
  direction: "row" | "col";
  children: JSX.Element | JSX.Element[];
  extendStyle?: string;
};

const WindowContainer = ({
  children,
  label,
  direction,
  extendStyle,
}: Props) => {
  let currentDirection = "flex-row";

  switch (direction) {
    case "row":
      currentDirection = "flex-row";
      break;
    case "col":
      currentDirection = "flex-col";
      break;
  }

  return (
    <div
      className={`relative flex gap-3 rounded-sm p-3 ${currentDirection} ${extendStyle}`}
    >
      <WindowTitleBar
        type={label}
        hideMode={true}
        hideClose={true}
        extendStyle="!bg-brand-black !border-none"
      />
      {children}
    </div>
  );
};

export default WindowContainer;
