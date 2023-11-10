import { tokenAuth } from "~/auth.server";
import DarkOverlay from "~/components/Layout/DarkOverlay";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import { redirect, type ActionArgs, type LoaderArgs } from "@remix-run/node";
import { useEffect, useState } from "react";
import BasicInput from "~/components/Forms/Input/BasicInput";
import { STAFF_SESSION_KEY } from "~/session.server";
import {
  approveStockTransfer,
  getStockTransfer,
  updateStockTransfer,
} from "~/models/stock.server";
import OrderStatusSteps from "~/components/Indicators/OrderStatusSteps";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import { getStores } from "~/models/stores.server";
import { getApprovalStatusList } from "~/models/enums.server";
import { capitalizeFirst } from "~/helpers/stringHelpers";
import useNotification from "~/hooks/PageNotification";

export const loader = async ({ request, params }: LoaderArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);
  if (!authenticated.valid) {
    return redirect("/login");
  }

  const id = params?.id;

  let stockTransferRequest;

  if (id && id !== "add") {
    stockTransferRequest = await getStockTransfer(id);
    const stores = await getStores();
    const statusList = await getApprovalStatusList();
    return { stockTransferRequest, stores, statusList };
  } else {
    return null;
  }
};

export const action = async ({ request, params }: ActionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);
  if (!authenticated.valid) {
    return redirect("/login");
  }
  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());
  const { toStoreId, status, quantity } = form;

  switch (form._action) {
    case "approve":
      const { permissionError: approvePermissionError } =
        await approveStockTransfer(request, id as string, toStoreId as string);
      if (approvePermissionError) {
        return { permissionError: approvePermissionError };
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
          quantity as string
        );
      if (updatePermissionError) {
        return {
          permissionError: updatePermissionError,
        };
      } else {
        if (status === "cancelled") {
          return {
            permissionError: null,
            notification,
          };
        } else {
          return {
            permissionError: null,
            notification,
          };
        }
      }
  }
};

const ModifyStockTransfer = () => {
  const { stockTransferRequest, stores, statusList } =
    useLoaderData() as unknown as {
      stockTransferRequest: StockTransferRequest;
      stores: Store[];
      statusList: ApprovalStatus[];
    };
  const { validationErrors, success, notification, permissionError } =
    (useActionData() as {
      success: boolean;
      notification: PageNotification;
      validationErrors: ValidationErrors;
      permissionError: string;
    }) || {};
  useNotification(notification);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const mode = stockTransferRequest ? "edit" : "add";

  useEffect(() => {
    if (success) {
      navigate(-1);
    }
    if (notification) {
      setLoading(false);
    }
  }, [success, navigate, notification]);

  return (
    <DarkOverlay>
      <Form
        method="POST"
        className="scrollbar-hide relative w-[500px] max-w-[100vw] overflow-y-auto bg-base-200 px-3 py-6 sm:px-6"
      >
        <FormHeader
          type="Stock Transfer"
          mode={mode}
          hasIsActive={false}
          hasDelete={false}
        />
        <input
          hidden
          readOnly
          name="toStoreId"
          value={stockTransferRequest.toStoreId}
        />
        <input
          hidden
          readOnly
          name="quantity"
          value={stockTransferRequest.quantity}
        />

        <div className="flex flex-col gap-3">
          <div className="flex justify-center rounded-lg bg-base-100 py-6">
            <OrderStatusSteps
              status={stockTransferRequest?.status}
              type="approvalStatus"
            />
          </div>

          {stockTransferRequest?.status === "created" && (
            <button
              className="btn btn-primary mx-auto mt-3 block w-max"
              type="submit"
              name="_action"
              value="approve"
            >
              Approve
            </button>
          )}

          {stockTransferRequest?.status !== "created" &&
            stockTransferRequest?.status !== "complete" &&
            stockTransferRequest?.status !== "cancelled" && (
              <BasicSelect
                label="Status"
                name="status"
                placeholder="Select a Status"
                customWidth="w-full"
                selections={statusList?.map((status: string) => ({
                  id: status,
                  name: capitalizeFirst(status),
                }))}
                defaultValue={stockTransferRequest.status}
              />
            )}

          <BasicInput
            name="sku"
            label="SKU"
            placeholder="SKU"
            type="text"
            customWidth="w-full"
            disabled={true}
            defaultValue={stockTransferRequest?.productVariant.sku || undefined}
            validationErrors={validationErrors}
          />

          <BasicSelect
            label="From Store"
            name="fromStore"
            placeholder="Select a Store"
            customWidth="w-full"
            selections={stores as unknown as SelectValue[]}
            disabled={true}
            defaultValue={stockTransferRequest.fromStoreId.toString()}
          />

          <BasicSelect
            label="To Store"
            name="toStore"
            placeholder="Select a Store"
            customWidth="w-full"
            selections={stores as unknown as SelectValue[]}
            disabled={true}
            defaultValue={stockTransferRequest.toStoreId.toString()}
          />

          <BasicInput
            name="quantity"
            label="Quantity"
            placeholder="Quantity"
            type="number"
            customWidth="w-full"
            disabled={true}
            defaultValue={stockTransferRequest?.quantity || undefined}
            validationErrors={validationErrors}
          />

          <BasicInput
            name="trackingNumber"
            label="Tracking Number"
            placeholder="Tracking number"
            type="text"
            customWidth="w-full"
            disabled={true}
            defaultValue={stockTransferRequest?.trackingNumber || undefined}
            validationErrors={validationErrors}
          />

          <BasicInput
            name="createdBy"
            label="Created By"
            placeholder="Created By"
            type="text"
            customWidth="w-full"
            disabled={true}
            defaultValue={stockTransferRequest?.createdBy || undefined}
            validationErrors={validationErrors}
          />
        </div>

        {permissionError && (
          <div className="mt-3 w-full pt-3 text-center text-sm text-error">
            {permissionError}
          </div>
        )}

        <BackSubmitButtons
          loading={loading}
          setLoading={setLoading}
          hideSubmit={
            stockTransferRequest?.status == "complete" ||
            stockTransferRequest?.status == "cancelled"
          }
        />
      </Form>
    </DarkOverlay>
  );
};

export default ModifyStockTransfer;
