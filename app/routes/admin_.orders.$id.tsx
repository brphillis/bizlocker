import { type ActionArgs, type LoaderArgs } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useLocation,
  useNavigate,
} from "@remix-run/react";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import OrderStatusSteps from "~/components/Indicators/OrderStatusSteps";
import DarkOverlay from "~/components/Layout/DarkOverlay";
import Spinner from "~/components/Spinner";
import {
  getOrder,
  getOrderShippingDetails,
  updateOrderShippingDetails,
  updateOrderStatus,
} from "~/models/orders.server";

export const loader = async ({ params }: LoaderArgs) => {
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

    case "loadShipping":
      return await getOrderShippingDetails(orderId as string);

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
      } = form;

      const shippingDetails: SquareShippingDetails = {
        firstName: firstName as string,
        lastName: lastName as string,
        addressLine1: addressLine1 as string,
        addressLine2: addressLine2 as string,
        locality: suburb as string,
        administrativeDistrictLevel1: state as string,
        postalCode: postcode as string,
        country: country as string,
      };

      return await updateOrderShippingDetails(
        orderId as string,
        shippingDetails
      );
  }
};

const ModifyOrder = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const order = useLoaderData() as Order;

  const { items } = (order as { items: OrderItem[] }) || {};

  const shippingDetails = useActionData() as SquareShippingDetails;
  const [viewingShippingDetails, setViewingShippingDetails] =
    useState<boolean>(false);

  return (
    <DarkOverlay>
      <div className="max-w-screen scrollbar-hide relative w-[800px] !max-w-[100vw] overflow-y-auto bg-base-300 px-3 py-6 sm:px-6">
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
            <OrderStatusSteps status={order?.status} />
          </div>

          {order?.status !== "created" && (
            <Form
              method="POST"
              action={pathname}
              className="mt-6 flex flex-col items-center justify-center gap-3"
            >
              <select
                name="status"
                className="select-bordered select w-full max-w-xs"
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
                className="btn-primary btn mt-3 w-max"
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

          {order.status !== ("created" || "cancelled") && (
            <>
              <div className="divider w-full" />

              <Form
                method="POST"
                action={pathname}
                className={`flex flex-col items-center 
                               ${!viewingShippingDetails ? "block" : "hidden"}`}
              >
                <input hidden readOnly name="orderId" value={order.orderId} />
                <button
                  type="submit"
                  name="_action"
                  value="loadShipping"
                  className="btn-primary btn w-max"
                  onClick={() => setViewingShippingDetails(true)}
                >
                  Load Shipping Details
                </button>
              </Form>

              {!shippingDetails && viewingShippingDetails && (
                <div className="flex justify-center">
                  <Spinner />
                </div>
              )}

              <Form
                method="POST"
                action={pathname}
                className={`flex flex-col items-center gap-3 
                  ${
                    viewingShippingDetails && shippingDetails
                      ? "block"
                      : "hidden"
                  }`}
              >
                <div className="pb-3 text-center">Shipping Details</div>
                <div className="flex flex-row flex-wrap justify-center gap-3">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">First Name</span>
                    </label>
                    <input
                      name="firstName"
                      type="text"
                      placeholder="First Name"
                      className="input-bordered input w-[95vw] sm:w-[215px]"
                      defaultValue={shippingDetails?.firstName}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Last Name</span>
                    </label>
                    <input
                      name="lastName"
                      type="text"
                      placeholder="Last Name"
                      className="input-bordered input w-[95vw] sm:w-[215px]"
                      defaultValue={shippingDetails?.lastName}
                    />
                  </div>
                </div>

                <div className="flex flex-row flex-wrap justify-center gap-3">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Address Line 1</span>
                    </label>
                    <input
                      name="addressLine1"
                      type="text"
                      placeholder="Address Line 1"
                      className="input-bordered input w-[95vw] sm:w-[215px]"
                      defaultValue={shippingDetails?.addressLine1}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Address Line 2</span>
                    </label>
                    <input
                      name="addressLine2"
                      type="text"
                      placeholder="Address Line 2"
                      className="input-bordered input w-[95vw] sm:w-[215px]"
                      defaultValue={shippingDetails?.addressLine2}
                    />
                  </div>
                </div>

                <div className="flex flex-row flex-wrap justify-center gap-3">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">City/Suburb</span>
                    </label>
                    <input
                      name="suburb"
                      type="text"
                      placeholder="State"
                      className="input-bordered input w-[95vw] sm:w-[215px]"
                      defaultValue={shippingDetails?.locality}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">State</span>
                    </label>
                    <input
                      name="state"
                      type="text"
                      placeholder="State"
                      className="input-bordered input w-[95vw] sm:w-[215px]"
                      defaultValue={
                        shippingDetails?.administrativeDistrictLevel1
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-row flex-wrap justify-center gap-3">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Post Code</span>
                    </label>
                    <input
                      name="postcode"
                      type="text"
                      placeholder="Post Code"
                      className="input-bordered input w-[95vw] sm:w-[215px]"
                      defaultValue={shippingDetails?.postalCode}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Country</span>
                    </label>
                    <input
                      name="country"
                      type="text"
                      placeholder="Country"
                      className="input-bordered input w-[95vw] sm:w-[215px]"
                      defaultValue={shippingDetails?.country}
                    />
                  </div>
                </div>

                <input readOnly hidden value={order.orderId} name="orderId" />
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    className="btn-primary btn"
                    onClick={() => setViewingShippingDetails(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    name="_action"
                    value="updateShipping"
                    className="btn-primary btn"
                    onClick={() => setViewingShippingDetails(false)}
                  >
                    Confirm
                  </button>
                </div>
              </Form>
            </>
          )}

          {order.status === "created" && (
            <>
              <div className="divider w-full" />

              <div className="flex justify-center">
                <button
                  type="button"
                  className="btn-primary btn w-max"
                  onClick={() =>
                    navigator.clipboard.writeText(order.paymentUrl)
                  }
                >
                  Copy Payment Link
                </button>
              </div>
            </>
          )}
          <div className="divider w-full" />

          <div className="flex flex-row justify-center gap-6">
            <button
              type="button"
              className="btn-primary btn mt-6 w-max"
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
