type Props = {
  label: string;
  name?: string;
  value?: string;
  onClick?: () => void;
  extendStyle?: string;
  type?: "button" | "reset" | "submit";
  hoverEffect?: "grow" | "color";
  disabled?: boolean;
};

const BasicButton = ({
  label,
  name,
  value,
  onClick,
  extendStyle,
  type,
  hoverEffect,
  disabled,
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
      name={name ? name : undefined}
      value={value ? value : undefined}
      className={`
      inline-flex h-[3rem] min-h-[3rem] text-sm cursor-pointer items-center justify-center rounded-sm border-[1px] pl-[1rem] pr-[1rem] text-center font-semibold shadow-sm
      ${disabled ? "opacity-75 btn-disabled" : ""}
       ${currentEffect} ${
         extendStyle
           ? extendStyle
           : "border-primary bg-primary text-brand-white transition-colors duration-300 hover:bg-primary-dark"
       } `}
      onClick={() => onClick && onClick()}
    >
      {label}
    </button>
  );
};

export default BasicButton;
