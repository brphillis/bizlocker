import { useSubmit } from "@remix-run/react";
import { IoAddCircle, IoRemoveCircle } from "react-icons/io5";

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
        className={"cursor-pointer text-white/20 " + extendStyle}
        onClick={() =>
          submit(
            { variantId: variantId.toString(), quantity: "1" },
            { method: "POST", action: "/products" }
          )
        }
      />
    );
  } else {
    return (
      <IoRemoveCircle
        size={size || 20}
        className={"cursor-pointer text-white/20 " + extendStyle}
        onClick={() =>
          submit(
            { variantId: variantId.toString(), quantity: "-1" },
            { method: "POST", action: "/products" }
          )
        }
      />
    );
  }
};

export default CartAddSubtractButton;
