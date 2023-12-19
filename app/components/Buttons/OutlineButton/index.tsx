type Props = {
  label: string;
  clickFunction: () => void;
  extendStyle?: string;
  type?: "button" | "reset" | "submit";
  hoverEffect?: "grow";
};

const OutlineButton = ({
  label,
  clickFunction,
  extendStyle,
  type,
  hoverEffect,
}: Props) => {
  let currentEffect = "";

  switch (hoverEffect) {
    case "grow":
      currentEffect = "hover:scale-[1.01] duration-300 ease-in-out";
  }

  return (
    <button
      type={type ? type : "button"}
      className={`
      inline-flex h-[3rem] min-h-[3rem] cursor-pointer items-center justify-center border-[2px] !bg-transparent pl-[1rem] pr-[1rem] text-center font-semibold shadow-sm
       ${currentEffect} ${extendStyle}`}
      onClick={() => clickFunction()}
    >
      {label}
    </button>
  );
};

export default OutlineButton;
