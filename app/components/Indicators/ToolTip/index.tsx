import { IoInformationCircle } from "react-icons/io5";

type Props = {
  tip: string;
  iconColor?: string;
};

const ToolTip = ({ tip, iconColor }: Props) => {
  return (
    <div
      className={`z-100 tooltip tooltip-left tooltip-primary absolute right-1 top-[12px] ${iconColor}`}
      data-tip={tip}
    >
      <IoInformationCircle />
    </div>
  );
};

export default ToolTip;
