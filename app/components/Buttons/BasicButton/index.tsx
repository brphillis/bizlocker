type Props = {
  label: string;
  clickFunction: () => void;
  extendStyle?: string;
  type?: "button" | "reset" | "submit";
};

const BasicButton = ({ label, clickFunction, extendStyle, type }: Props) => {
  return (
    <button
      type={type ? type : "button"}
      className={`btn btn-primary ` + extendStyle}
      onClick={() => clickFunction()}
    >
      {label}
    </button>
  );
};

export default BasicButton;
