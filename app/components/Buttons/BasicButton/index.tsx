type Props = {
  label: string;
  clickFunction: () => void;
  extendStyle?: string;
  type?: "button" | "reset" | "submit";
  hoverEffect?: "grow" | "color";
};

const BasicButton = ({
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
      break;
    case "color":
      currentEffect = "hover:brightness-110 duration-300 ease-in-out";
      break;
  }

  return (
    <button
      type={type ? type : "button"}
      className={`
      inline-flex h-[3rem] min-h-[3rem] cursor-pointer items-center justify-center border-[1px] pl-[1rem] pr-[1rem] text-center font-semibold shadow-sm
       ${currentEffect} ${
        extendStyle
          ? extendStyle
          : "bg-primary text-brand-white hover:bg-primary-dark"
      } `}
      onClick={() => clickFunction()}
    >
      {label}
    </button>
  );
};

export default BasicButton;
