import { useEffect, useState } from "react";
import DarkOverlay from "~/components/Layout/Overlays/DarkOverlay";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import { type ValidationErrors } from "~/utility/validate";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import useNotification from "~/hooks/PageNotification";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import WindowContainer from "~/components/Layout/Containers/WindowContainer";
import { cartUpsertLoader } from "./index.server";
import { CartItemWithDetails } from "~/models/Cart/types";
import ProductCard_Cart from "~/components/Cards/ProductCard_Cart";
import BasicInput from "~/components/Forms/Input/BasicInput";

const CartUpsert = () => {
  const { cart } = useLoaderData<typeof cartUpsertLoader>();
  const { serverValidationErrors, success, notification } =
    (useActionData() as ActionReturnTypes) || {};

  const navigate = useNavigate();
  useNotification(notification);

  const [clientValidationErrors] = useState<ValidationErrors>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (success) {
      navigate(-1);
    }
  }, [success, navigate]);

  return (
    <DarkOverlay>
      <WindowContainer title="Cart">
        <Form
          method="POST"
          className="scrollbar-hide relative w-[500px] max-w-full overflow-y-auto"
        >
          <div className="flex flex-col gap-3">
            <BasicInput
              label="User Email"
              type="text"
              name="userEmail"
              placeholder="User Email"
              extendContainerStyle="w-full"
              disabled={true}
              defaultValue={cart?.user?.email}
            />

            <BasicInput
              label="Created"
              type="text"
              name="created"
              placeholder="Created"
              extendContainerStyle="w-full"
              disabled={true}
              defaultValue={cart?.createdAt}
            />

            <BasicInput
              label="Updated"
              type="text"
              name="updated"
              placeholder="Updated"
              extendContainerStyle="w-full"
              disabled={true}
              defaultValue={cart?.updatedAt}
            />
          </div>

          <div className="flex flex-col flex-wrap items-center justify-center gap-3 mt-6">
            {cart?.cartItems?.map(
              ({ variant, quantity }: CartItemWithDetails) => {
                if (variant) {
                  return (
                    <ProductCard_Cart
                      key={"cartItem-" + variant?.product?.name}
                      variant={variant}
                      quantity={quantity}
                    />
                  );
                } else return null;
              },
            )}
          </div>

          <BackSubmitButtons
            loading={loading}
            setLoading={setLoading}
            validationErrors={serverValidationErrors || clientValidationErrors}
          />
        </Form>
      </WindowContainer>
    </DarkOverlay>
  );
};

export default CartUpsert;
