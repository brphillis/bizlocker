import { type FormEvent } from "react";
import { getFormData } from "~/helpers/formHelpers";
import DarkOverlay from "~/components/Layout/Overlays/DarkOverlay";
import BasicInput from "~/components/Forms/Input/BasicInput";
import PhoneInput from "~/components/Forms/Input/PhoneInput";
import { ActionReturnTypes } from "~/utility/actionTypes";
import SelectCountry from "~/components/Forms/Select/SelectCountry";
import OrderStatusSteps from "~/components/Indicators/OrderStatusSteps";
import useNotification from "~/hooks/PageNotification";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
  useSearchParams,
  useParams,
} from "@remix-run/react";
import WindowContainer from "~/components/Layout/Containers/WindowContainer";
import { orderUpsertLoader } from "./index.server";
import { OrderItemWithDetails } from "~/models/Orders/types";
import ProductCard_Cart from "~/components/Cards/ProductCard_Cart";

const OrderUpsert = () => {
  const { order } = useLoaderData<typeof orderUpsertLoader>();
  const { notification } = (useActionData() as ActionReturnTypes) || {};

  const navigate = useNavigate();
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const contentId = searchParams.get("contentId");
  const { contentType } = useParams();
  useNotification(notification);

  const { items, address, status, id: orderId } = order;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const form = getFormData(event);
    event.preventDefault();

    submit(form, {
      method: "POST",
      action: `/admin/upsert/${contentType}?contentId=${contentId}`,
    });
  };

  return (
    <DarkOverlay>
      <WindowContainer title={`Order - ${order?.id}`}>
        <div className="scrollbar-hide relative w-[600px] max-w-full overflow-y-auto">
          <div className="form-control">
            <div className="flex justify-center rounded-lg bg-base-100 py-6">
              <OrderStatusSteps
                status={status as OrderStatus}
                type="orderStatus"
              />
            </div>

            {order.status === "created" && (
              <>
                <div className="divider w-full" />

                <div className="flex justify-center">
                  <button
                    type="button"
                    className="btn btn-primary w-max"
                    onClick={() =>
                      navigator.clipboard.writeText(order.paymentUrl)
                    }
                  >
                    Copy Payment Link
                  </button>
                </div>
              </>
            )}

            {order?.status !== "created" && (
              <Form
                method="POST"
                onSubmit={handleSubmit}
                className="mt-6 flex flex-col items-center justify-center gap-3"
              >
                <select name="status" className=" select w-full max-w-xs">
                  <option value="">Select Status</option>
                  <option value="paid">Paid</option>
                  <option value="shipped">Shipped</option>
                  <option value="complete">Complete</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <input
                  readOnly
                  hidden
                  name="orderId"
                  value={orderId || undefined}
                />

                <button
                  type="submit"
                  name="_action"
                  value="updateStatus"
                  className="btn btn-primary mt-3 w-max"
                >
                  Update Status
                </button>
              </Form>
            )}

            <div className="divider w-full" />

            <div className="pb-3 text-center">Order Details</div>
            <div className="pb-6 text-center text-sm opacity-50">
              Account: {order?.user?.email}
            </div>

            <div className="flex flex-col flex-wrap items-center justify-center gap-3">
              {items?.map(({ variant, quantity }: OrderItemWithDetails) => {
                if (variant) {
                  return (
                    <ProductCard_Cart
                      key={"cartItem-" + variant?.product?.name}
                      variant={variant}
                      quantity={quantity}
                    />
                  );
                } else return null;
              })}

              <div className="mt-3 text-center">
                <div>Order Total: ${order.totalPrice.toFixed(2)}</div>
              </div>
            </div>

            <div className="divider w-full" />

            <Form
              method="POST"
              onSubmit={handleSubmit}
              className="flex flex-col items-center gap-3"
            >
              <div className="pb-3 text-center">Shipping Details</div>

              <BasicInput
                name="firstName"
                label="First Name"
                placeholder="First Name"
                type="text"
                extendContainerStyle="w-full"
                defaultValue={order?.firstName}
              />

              <BasicInput
                name="lastName"
                label="Last Name"
                placeholder="Last Name"
                type="text"
                extendContainerStyle="w-full"
                defaultValue={order?.lastName}
              />

              <BasicInput
                name="addressLine1"
                label="Address Line 1"
                placeholder="Address Line 1"
                type="text"
                extendContainerStyle="w-full"
                defaultValue={address?.addressLine1}
              />

              <BasicInput
                name="addressLine2"
                label="Address Line 2"
                placeholder="Address Line 2"
                type="text"
                extendContainerStyle="w-full"
                defaultValue={address?.addressLine2}
              />

              <BasicInput
                name="suburb"
                label="Suburb"
                placeholder="Suburb"
                type="text"
                extendContainerStyle="w-full"
                defaultValue={address?.suburb}
              />

              <BasicInput
                name="state"
                label="state"
                placeholder="State"
                type="text"
                extendContainerStyle="w-full"
                defaultValue={address?.state}
              />

              <BasicInput
                name="postcode"
                label="Post Code"
                placeholder="Post Code"
                type="text"
                extendContainerStyle="w-full"
                defaultValue={address?.postcode}
              />

              <SelectCountry
                defaultValue={address?.country}
                extendStyle="!w-full"
              />

              <PhoneInput
                name="phoneNumber"
                label="Phone Number"
                placeholder="Phone Number"
                extendContainerStyle="w-full"
                extendStyle="input-bordered"
                type="text"
                defaultValue={order?.phoneNumber || undefined}
              />

              <BasicInput
                name="shippingMethod"
                label="Shipping Method"
                placeholder="Shipping Method"
                type="text"
                extendContainerStyle="w-full"
                defaultValue={order?.shippingMethod}
              />

              <BasicInput
                name="shippingPrice"
                label="Shipping Price"
                placeholder="Shipping Price"
                type="text"
                extendContainerStyle="w-full"
                defaultValue={order?.shippingPrice}
              />

              <BasicInput
                name="trackingNumber"
                label="Tracking Number"
                placeholder="Tracking Number"
                type="text"
                extendContainerStyle="w-full"
                defaultValue={order?.trackingNumber}
              />

              <BasicInput
                name="paymentLinkId"
                label="Payment Id"
                placeholder="Payment Id"
                type="text"
                extendContainerStyle="w-full"
                defaultValue={order?.paymentCode}
              />

              <input
                readOnly
                hidden
                value={order?.id || undefined}
                name="orderId"
              />

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="submit"
                  name="_action"
                  value="updateShipping"
                  className="btn btn-primary"
                >
                  Update Shipping
                </button>
              </div>
            </Form>

            <div className="divider w-full" />

            <div className="flex flex-row justify-center">
              <button
                type="button"
                className="btn btn-primary w-max !rounded-sm"
                onClick={() => navigate(-1)}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </WindowContainer>
    </DarkOverlay>
  );
};

export default OrderUpsert;
