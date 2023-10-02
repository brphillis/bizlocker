import { IoInformationCircle } from "react-icons/io5";

type Props = {
  tip: string;
};

const ToolTip = ({ tip }: Props) => {
  return (
    <div
      className="z-100 tooltip-primary tooltip absolute right-1 top-[12px]"
      data-tip={tip}
    >
      <IoInformationCircle />
    </div>
  );
};

export default ToolTip;
