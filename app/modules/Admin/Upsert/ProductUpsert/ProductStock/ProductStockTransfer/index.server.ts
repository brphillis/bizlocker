import { Staff } from "@prisma/client";
import { json } from "@remix-run/node";
import { getStores } from "~/models/Stores/index.server";
import { PageNotification } from "~/hooks/PageNotification";
import { NewStockTransferRequest } from "~/models/Stock/types";
import { getProductVariant } from "~/models/Products/index.server";
import { createStockTransferRequest } from "~/models/Stock/index.server";
import { getUserDataFromSession, STAFF_SESSION_KEY } from "~/session.server";

export const productStockTransferLoader = async (request: Request) => {
  const { storeId: userStoreId } =
    ((await getUserDataFromSession(request, STAFF_SESSION_KEY)) as Staff) || {};

  const { searchParams } = new URL(request.url);
  const variantId = searchParams.get("contentId");
  const fromStoreId = searchParams.get("fromStore");

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

export const productStockTransferAction = async (request: Request) => {
  const form = Object.fromEntries(await request.formData());
  const { variantId, fromStoreId, toStoreId, fromStoreStock, toStoreStock } =
    form;

  let notification: PageNotification;

  const validationErrors: string[] = [];

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
    case "upsert": {
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
  }

  return { success: false };
};
