import { tokenAuth } from "~/auth.server";
import type { Staff } from "@prisma/client";
import type { Params } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { getStores } from "~/models/stores.server";
import { getProductVariant } from "~/models/products.server";
import type { PageNotification } from "~/hooks/PageNotification";
import { getUserDataFromSession, STAFF_SESSION_KEY } from "~/session.server";
import {
  createStockTransferRequest,
  type NewStockTransferRequest,
} from "~/models/stock.server";

export const productStockTransferLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const { storeId: userStoreId } =
    ((await getUserDataFromSession(request, STAFF_SESSION_KEY)) as Staff) || {};

  let { searchParams } = new URL(request.url);
  let variantId = searchParams.get("contentId");
  let fromStoreId = searchParams.get("fromStore");

  if (!variantId) {
    throw new Response(null, {
      status: 404,
      statusText: "Stock Not Found",
    });
  }

  if (!fromStoreId) {
    throw new Response(null, {
      status: 404,
      statusText: "No From Store Selected",
    });
  }

  const variant = await getProductVariant(variantId);

  if (!variant) {
    throw new Response(null, {
      status: 404,
      statusText: "Stock Not Found",
    });
  }

  const stores = await getStores();

  return json({
    stores,
    fromStoreId,
    userStoreId,
    variant,
  });
};

export const productStockTransferAction = async (
  request: Request,
  params: Params<string>,
) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);
  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const form = Object.fromEntries(await request.formData());
  const { variantId, fromStoreId, toStoreId, fromStoreStock, toStoreStock } =
    form;

  let notification: PageNotification;

  let validationErrors: string[] = [];

  if (
    !fromStoreStock ||
    Number(fromStoreStock) === 0 ||
    !toStoreStock ||
    Number(toStoreStock) === 0
  ) {
    validationErrors.push("There is no stock to Request");
  }

  if (Number(fromStoreStock) < Number(toStoreStock)) {
    validationErrors.push("Not enough Stock to Request");
  }

  if (validationErrors.length > 0) {
    return json({ validationErrors });
  }

  switch (form._action) {
    case "upsert":
      const { email } =
        ((await getUserDataFromSession(request, STAFF_SESSION_KEY)) as Staff) ||
        {};

      const upsertData: NewStockTransferRequest = {
        variantId: variantId as string,
        fromStoreId: fromStoreId as string,
        toStoreId: toStoreId as string,
        quantity: toStoreStock as string,
        createdBy: email,
      };

      await createStockTransferRequest(upsertData);

      notification = {
        type: "success",
        message: "Stock Transfer Request Created",
      };

      return { success: true, notification };
  }

  return { success: false };
};
