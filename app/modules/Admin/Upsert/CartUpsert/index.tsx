import { FormEvent, useEffect, useState } from "react";
import { IoTrashSharp } from "react-icons/io5";
import { getFormData } from "~/helpers/formHelpers";
import useNotification from "~/hooks/PageNotification";
import { CartItemWithDetails } from "~/models/Cart/types";
import BasicInput from "~/components/Forms/Input/BasicInput";
import { ActionReturnTypes } from "~/utility/actionTypes";
import { ActionAlert } from "~/components/Notifications/Alerts";
import DarkOverlay from "~/components/Layout/Overlays/DarkOverlay";
import ProductCard_Cart from "~/components/Cards/ProductCard_Cart";
import { type ValidationErrors, validateForm } from "~/utility/validate";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import WindowContainer, {
  handleWindowedFormData,
} from "~/components/Layout/Containers/WindowContainer";

import { cartUpsertLoader } from "./index.server";

const validateOptions = {};

const CartUpsert = () => {
  const { cart } = useLoaderData<typeof cartUpsertLoader>();
  const { serverValidationErrors, success, notification } =
    (useActionData() as ActionReturnTypes) || {};

  const navigate = useNavigate();
  const submit = useSubmit();
  useNotification(notification);

  const [clientValidationErrors] = useState<ValidationErrors>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    let form = getFormData(event);
    event.preventDefault();

    form = handleWindowedFormData(form);

    const { formEntries } = validateForm(new FormData(form), validateOptions);

    if (formEntries._action === "delete") {
      ActionAlert(
        "Warning",
        "Delete this Cart?",
        () => {
          submit(form, {
            method: "POST",
          });
        },
        () => {
          setLoading(false);
          return;
        },
        "warning",
      );
    }
  };

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
          onSubmit={handleSubmit}
          className="scrollbar-hide relative w-[500px] max-w-full"
        >
          <button
            type="submit"
            name="_action"
            value="delete"
            className="absolute z-50 top-[-10px] max-md:top-0 right-0 text-white bg-error rounded-full p-1 text-sm"
          >
            <IoTrashSharp />
          </button>

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
            hideSubmit={true}
            validationErrors={serverValidationErrors || clientValidationErrors}
          />
        </Form>
      </WindowContainer>
    </DarkOverlay>
  );
};

export default CartUpsert;
