import type { Params } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { PageNotification } from "~/hooks/PageNotification";
import {
  getOrder,
  updateOrderShippingDetails,
  updateOrderStatus,
} from "~/models/orders.server";
export const orderUpsertLoader = async (
  request: Request,
  params: Params<string>,
) => {
  let { searchParams } = new URL(request.url);
  let id = searchParams.get("contentId") || undefined;

  if (!id) {
    throw new Response(null, {
      status: 404,
      statusText: "Order Not Found",
    });
  }

  let order = await getOrder(id);

  if (!order) {
    throw new Response(null, {
      status: 404,
      statusText: "Order Not Found",
    });
  }

  return json({ order });
};

export const orderUpsertAction = async (
  request: Request,
  params: Params<string>,
) => {
  let notification: PageNotification;

  const form = Object.fromEntries(await request.formData());
  const { orderId } = form;

  switch (form._action) {
    case "updateStatus":
      const { status } = form;
      await updateOrderStatus(orderId as string, status as OrderStatus);

      notification = {
        type: "success",
        message: "Order Status Updated",
      };

      return { notification };

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

      await updateOrderShippingDetails(
        orderId as string,
        firstName as string,
        lastName as string,
        addressLine1 as string,
        addressLine2 as string,
        suburb as string,
        state as string,
        postcode as string,
        country as string,
        trackingNumber as string,
      );

      notification = {
        type: "success",
        message: "Shipping Details Updated",
      };

      return { notification };
  }
};
