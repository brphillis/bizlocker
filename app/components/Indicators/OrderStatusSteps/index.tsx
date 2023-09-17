import { IoCloseCircle } from "react-icons/io5";

type Props = {
  status: OrderStatus;
};

const OrderStatusSteps = ({ status }: Props) => {
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
    return (
      <ul className="steps z-0">
        <li className={getStepClass(status, "created")}>Created</li>
        <li className={getStepClass(status, "paid")}>Paid</li>
        <li className={getStepClass(status, "shipped")}>Shipped</li>
        <li className={getStepClass(status, "complete")}>Complete</li>
      </ul>
    );
  } else {
    return (
      <div className="flex flex-col items-center gap-3">
        <div>Order Cancelled</div>
        <IoCloseCircle className="text-red-500" size={42} />
      </div>
    );
  }
};

export default OrderStatusSteps;
