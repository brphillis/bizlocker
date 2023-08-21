import { useSubmit } from "@remix-run/react";
import { IoAddCircle, IoRemoveCircle } from "react-icons/io5";
import { Toast } from "~/components/Notifications/Toast";

type Props = {
  mode: "add" | "subtract";
  variantId: string;
  size?: number;
  extendStyle?: string;
};

const CartAddSubtractButton = ({
  mode,
  variantId,
  size,
  extendStyle,
}: Props) => {
  const submit = useSubmit();

  if (mode == "add") {
    return (
      <IoAddCircle
        size={size || 20}
        className={"cursor-pointer text-brand-black/75 " + extendStyle}
        onClick={() => {
          submit(
            { variantId: variantId.toString(), quantity: "1" },
            { method: "POST", action: "/products" }
          );
          Toast("success", 2000, "Item Added");
        }}
      />
    );
  } else {
    return (
      <IoRemoveCircle
        size={size || 20}
        className={"cursor-pointer text-brand-black/75 " + extendStyle}
        onClick={() => {
          submit(
            { variantId: variantId.toString(), quantity: "-1" },
            { method: "POST", action: "/products" }
          );
          Toast("warning", 2000, "Item Removed");
        }}
      />
    );
  }
};

export default CartAddSubtractButton;
