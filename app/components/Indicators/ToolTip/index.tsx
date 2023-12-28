import { IoInformationCircle } from "react-icons/io5";

type Props = {
  tip: string;
  iconColor?: string;
};

const ToolTip = ({ tip, iconColor }: Props) => {
  return (
    <div
      className={`z-100 tooltip tooltip-top tooltip-primary absolute right-1 top-[12px] max-md:tooltip-left ${iconColor}`}
      data-tip={tip}
    >
      <IoInformationCircle />
    </div>
  );
};

export default ToolTip;
