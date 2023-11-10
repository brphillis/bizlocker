import { IoCloseCircle } from "react-icons/io5";

type Props = {
  status: OrderStatus | ApprovalStatus;
  type: "orderStatus" | "approvalStatus";
};

const OrderStatusSteps = ({ status, type }: Props) => {
  const getStepClass = (status: string, stepStatus: string) => {
    return [
      "step",
      "mx-2",
      "before:!bg-base-200",
      "after:!bg-base-200",
      status === stepStatus ? "!step-primary" : "",
    ].join(" ");
  };

  if (status !== "cancelled") {
    if (type === "approvalStatus") {
      return (
        <ul className="steps z-0">
          <li className={getStepClass(status, "created")}>Created</li>
          <li className={getStepClass(status, "approved")}>Approved</li>
          <li className={getStepClass(status, "processing")}>Processing</li>
          <li className={getStepClass(status, "complete")}>Complete</li>
        </ul>
      );
    } else {
      return (
        <ul className="steps z-0">
          <li className={getStepClass(status, "created")}>Created</li>
          <li className={getStepClass(status, "paid")}>Paid</li>
          <li className={getStepClass(status, "shipped")}>Shipped</li>
          <li className={getStepClass(status, "complete")}>Complete</li>
        </ul>
      );
    }
  } else {
    return (
      <div className="flex flex-col items-center gap-3">
        <div>Cancelled.</div>
        <IoCloseCircle className="text-red-500" size={42} />
      </div>
    );
  }
};

export default OrderStatusSteps;
