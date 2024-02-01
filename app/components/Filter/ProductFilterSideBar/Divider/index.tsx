type Props = {
  extendStyle?: string;
  color?: "black" | "white";
};

const Divider = ({ extendStyle, color }: Props) => {
  let currentColor = "border-brand-black/5";

  switch (color) {
    case "white":
      currentColor = "border-brand-white/5";
  }

  return <div className={`w-full border-b-2 ${currentColor} ${extendStyle}`} />;
};

export default Divider;
