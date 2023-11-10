import { redirect, type ActionArgs, type LoaderArgs } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useLocation,
  useNavigate,
} from "@remix-run/react";
import { IoClose } from "react-icons/io5";
import { tokenAuth } from "~/auth.server";
import BasicInput from "~/components/Forms/Input/BasicInput";
import PhoneInput from "~/components/Forms/Input/PhoneInput";
import SelectCountry from "~/components/Forms/Select/SelectCountry";
import OrderStatusSteps from "~/components/Indicators/OrderStatusSteps";
import DarkOverlay from "~/components/Layout/DarkOverlay";
import {
  getOrder,
  updateOrderShippingDetails,
  updateOrderStatus,
} from "~/models/orders.server";
import { STAFF_SESSION_KEY } from "~/session.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);
  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const id = params.id;
  const order = id && (await getOrder(id));
  return order;
};

export const action = async ({ request }: ActionArgs) => {
  const form = Object.fromEntries(await request.formData());
  const { orderId } = form;

  switch (form._action) {
    case "updateStatus":
      const { status } = form;
      return await updateOrderStatus(orderId as string, status as OrderStatus);

    case "updateShipping":
      const {
        firstName,
        lastName,
        addressLine1,
        addressLine2,
        suburb,
        state,
        postcode,
        country,
        trackingNumber,
      } = form;

      return await updateOrderShippingDetails(
        orderId as string,
        firstName as string,
        lastName as string,
        addressLine1 as string,
        addressLine2 as string,
        suburb as string,
        state as string,
        postcode as string,
        country as string,
        trackingNumber as string
      );
  }
};

const ModifyOrder = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const order = useLoaderData();

  const { items, address } =
    (order as { items: OrderItem[]; address: Address }) || {};

  return (
    <DarkOverlay>
      <div className="scrollbar-hide relative w-[600px] max-w-[100vw] overflow-y-auto bg-base-200 px-3 py-6 sm:px-6">
        <button className="absolute right-3 top-3 cursor-pointer">
          <IoClose onClick={() => navigate("..")} />
        </button>
        <div className="mb-3 flex w-[100%] flex-row justify-between">
          <h1>
            Manage Order -&nbsp;
            <span className="text-sm opacity-50">{order?.orderId}</span>
          </h1>
        </div>

        <div className="divider w-full" />

        <div className="form-control">
          <div className="flex justify-center rounded-lg bg-base-100 py-6">
            <OrderStatusSteps status={order?.status} type="orderStatus" />
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
              action={pathname}
              className="mt-6 flex flex-col items-center justify-center gap-3"
            >
              <select
                name="status"
                className=" select w-full max-w-xs"
                placeholder="Select a Value"
              >
                <option value="">Select Status</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
                <option value="complete">Complete</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <input readOnly hidden name="orderId" value={order.orderId} />
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
            Account: {order.user.email}
          </div>

          <div className="flex flex-col flex-wrap items-center justify-center gap-3">
            {items
              ?.sort((a, b) =>
                a.variant.product.name.localeCompare(b.variant.product.name)
              )
              .reverse()
              .map(({ variant, quantity }: OrderItem) => {
                const { product, price, salePrice, isOnSale } = variant;

                return (
                  <div
                    className="relative flex w-full max-w-full flex-row items-center rounded-lg bg-base-100 p-3"
                    key={"cartItem-" + product.name}
                  >
                    <div className="relative w-full text-center">
                      <div>
                        {product?.name} x {quantity}
                      </div>
                      <div className="text-xs opacity-50">{variant?.name}</div>
                      <div className="!rounded-none">
                        $
                        {isOnSale
                          ? salePrice?.toFixed(2)
                          : price?.toFixed(2) + " ea"}
                      </div>
                    </div>
                  </div>
                );
              })}

            <div className="mt-3 text-center">
              <div>Order Total: ${order.totalPrice.toFixed(2)}</div>
            </div>
          </div>

          <div className="divider w-full" />

          <Form
            method="POST"
            action={pathname}
            className="flex flex-col items-center gap-3"
          >
            <div className="pb-3 text-center">Shipping Details</div>

            <BasicInput
              name="firstName"
              label="First Name"
              placeholder="First Name"
              type="text"
              customWidth="w-full"
              defaultValue={order?.firstName}
            />

            <BasicInput
              name="lastName"
              label="Last Name"
              placeholder="Last Name"
              type="text"
              customWidth="w-full"
              defaultValue={order?.lastName}
            />

            <BasicInput
              name="addressLine1"
              label="Address Line 1"
              placeholder="Address Line 1"
              type="text"
              customWidth="w-full"
              defaultValue={address?.addressLine1}
            />

            <BasicInput
              name="addressLine2"
              label="Address Line 2"
              placeholder="Address Line 2"
              type="text"
              customWidth="w-full"
              defaultValue={address?.addressLine2}
            />

            <BasicInput
              name="suburb"
              label="Suburb"
              placeholder="Suburb"
              type="text"
              customWidth="w-full"
              defaultValue={address?.suburb}
            />

            <BasicInput
              name="state"
              label="state"
              placeholder="State"
              type="text"
              customWidth="w-full"
              defaultValue={address?.state}
            />

            <BasicInput
              name="postcode"
              label="Post Code"
              placeholder="Post Code"
              type="text"
              customWidth="w-full"
              defaultValue={address?.postcode}
            />

            <SelectCountry defaultValue={address?.country} styles="!w-full" />

            <PhoneInput
              name="phoneNumber"
              label="Phone Number"
              placeholder="Phone Number"
              customWidth="w-full"
              styles="input-bordered"
              type="text"
              defaultValue={order?.phoneNumber || undefined}
            />

            <BasicInput
              name="shippingMethod"
              label="Shipping Method"
              placeholder="Shipping Method"
              type="text"
              customWidth="w-full"
              defaultValue={order?.shippingMethod}
            />

            <BasicInput
              name="shippingPrice"
              label="Shipping Price"
              placeholder="Shipping Price"
              type="text"
              customWidth="w-full"
              defaultValue={order?.shippingPrice}
            />

            <BasicInput
              name="trackingNumber"
              label="Tracking Number"
              placeholder="Tracking Number"
              type="text"
              customWidth="w-full"
              defaultValue={order?.trackingNumber}
            />

            <input readOnly hidden value={order.orderId} name="orderId" />

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
              onClick={() => navigate("..")}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </DarkOverlay>
  );
};

export default ModifyOrder;
