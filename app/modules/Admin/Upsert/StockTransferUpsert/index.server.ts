import { json } from "@remix-run/node";
import { validateForm } from "~/utility/validate";
import { getStores } from "~/models/Stores/index.server";
import { getApprovalStatusList } from "~/models/enums.server";
import {
  approveStockTransfer,
  getStockTransfer,
  updateStockTransfer,
} from "~/models/Stock/index.server";
import { StockTransferRequestWithDetails } from "~/models/Stock/types";

const validateOptions = {};

export const stockTransferUpsertLoader = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("contentId");

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

export const stockTransferUpsertAction = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("contentId");

  const { formEntries, formErrors } = validateForm(
    await request.formData(),
    validateOptions,
  );

  if (formErrors) {
    return { serverValidationErrors: formErrors };
  }

  const { toStoreId, status, quantity } = formEntries;

  switch (formEntries._action) {
    case "approve": {
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
    }

    case "upsert": {
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
  }
};
