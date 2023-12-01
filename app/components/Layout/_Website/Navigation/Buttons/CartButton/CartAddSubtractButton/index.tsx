import { useNavigation, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { IoAddCircle, IoRemoveCircle } from "react-icons/io5";
import { Toast } from "~/components/Notifications/Toast";
import Spinner from "~/components/Spinner";

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
  const navigation = useNavigation();

  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (location && loading) {
      if (navigation.state === "submitting") {
        setSubmitted(true);
      }

      if (submitted && navigation.state === "idle") {
        Toast("success", 3000, "Cart Modified");

        setLoading(false);
        setSubmitted(false);
      }
    }
  }, [navigation, loading, submitted]);

  if (mode == "add") {
    return (
      <>
        <IoAddCircle
          size={size || 20}
          className={
            "cursor-pointer text-brand-black/25 hover:text-brand-black/50 " +
            extendStyle
          }
          onClick={() => {
            setLoading(true);
            submit(
              { variantId: variantId.toString(), quantity: "1" },
              { method: "POST", action: "/products" }
            );
          }}
        />
        {loading && (
          <Spinner
            mode="circle"
            size="extraSmall"
            extendStyle="absolute bottom-3 right-3"
          />
        )}
      </>
    );
  } else {
    return (
      <>
        <IoRemoveCircle
          size={size || 20}
          className={
            "cursor-pointer text-brand-black/25 hover:text-brand-black/50 " +
            extendStyle
          }
          onClick={() => {
            setLoading(true);
            submit(
              { variantId: variantId.toString(), quantity: "-1" },
              { method: "POST", action: "/products" }
            );
          }}
        />
        {loading && (
          <Spinner
            mode="circle"
            size="extraSmall"
            extendStyle="absolute bottom-3 right-3"
          />
        )}
      </>
    );
  }
};

export default CartAddSubtractButton;
