type Props = {
  label: string;
  clickFunction: () => void;
  extendStyle?: string;
};

const BasicButton = ({ label, clickFunction, extendStyle }: Props) => {
  return (
    <button
      className={`btn btn-primary ` + extendStyle}
      onClick={() => clickFunction()}
    >
      {label}
    </button>
  );
};

export default BasicButton;
