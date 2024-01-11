import { json } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { validateForm } from "~/utility/validate";
import { getStores } from "~/models/stores.server";
import { getApprovalStatusList } from "~/models/enums.server";
import {
  approveStockTransfer,
  getStockTransfer,
  type StockTransferRequestWithDetails,
  updateStockTransfer,
} from "~/models/stock.server";

const validateOptions = {};

export const stockTransferUpsertLoader = async (
  request: Request,
  params: Params<string>,
) => {
  let { searchParams } = new URL(request.url);
  let id = searchParams.get("contentId");

  if (!id) {
    throw new Response(null, {
      status: 404,
      statusText: "Request Not Found",
    });
  }

  const stores = await getStores();
  const statusList = await getApprovalStatusList();

  const stockTransferRequest =
    id === "add"
      ? ({} as StockTransferRequestWithDetails)
      : await getStockTransfer(id);

  if (!stockTransferRequest) {
    throw new Response(null, {
      status: 404,
      statusText: "Request Not Found",
    });
  }

  return json({ stockTransferRequest, stores, statusList });
};

export const stockTransferUpsertAction = async (
  request: Request,
  params: Params<string>,
) => {
  let { searchParams } = new URL(request.url);
  let id = searchParams.get("contentId");

  const { formEntries, formErrors } = validateForm(
    await request.formData(),
    validateOptions,
  );

  if (formErrors) {
    return { serverValidationErrors: formErrors };
  }

  const { toStoreId, status, quantity } = formEntries;

  switch (formEntries._action) {
    case "approve":
      const { permissionError: approvePermissionError } =
        await approveStockTransfer(request, id as string, toStoreId as string);
      if (approvePermissionError) {
        return json({ permissionError: approvePermissionError });
      } else
        return {
          permissionError: null,
          notification: {
            type: "success",
            message: "Stock Transfer Approved.",
          },
        };

    case "upsert":
      const { permissionError: updatePermissionError, notification } =
        await updateStockTransfer(
          request,
          id as string,
          toStoreId as string,
          status as ApprovalStatus,
          quantity as string,
        );
      if (updatePermissionError) {
        return json({
          permissionError: updatePermissionError,
        });
      } else {
        if (status === "cancelled") {
          return json({
            permissionError: null,
            notification,
          });
        } else {
          return json({
            permissionError: null,
            notification,
          });
        }
      }
  }
};
