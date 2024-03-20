type Props = {
  to: string;
  extendStyle?: string;
  children?: JSX.Element | JSX.Element[];
};

const ExternalLink = ({ to, extendStyle, children }: Props) => {
  const handleClick = () => {
    if (!to.startsWith("http://") && !to.startsWith("https://")) {
      to = "http://" + to;
    }

    window.open(to, "_blank");
  };

  return (
    <button className={extendStyle} onClick={handleClick}>
      {children}
    </button>
  );
};

export default ExternalLink;
