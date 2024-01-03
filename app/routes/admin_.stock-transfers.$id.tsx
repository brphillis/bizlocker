import { type FormEvent, useEffect, useState } from "react";
import { tokenAuth } from "~/auth.server";
import { getStores } from "~/models/stores.server";
import { getFormData } from "~/helpers/formHelpers";
import { STAFF_SESSION_KEY } from "~/session.server";
import useNotification from "~/hooks/PageNotification";
import DarkOverlay from "~/components/Layout/DarkOverlay";
import { capitalizeFirst } from "~/helpers/stringHelpers";
import BasicInput from "~/components/Forms/Input/BasicInput";
import { getApprovalStatusList } from "~/models/enums.server";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import { ActionAlert } from "~/components/Notifications/Alerts";
import OrderStatusSteps from "~/components/Indicators/OrderStatusSteps";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  approveStockTransfer,
  getStockTransfer,
  type StockTransferRequestWithDetails,
  updateStockTransfer,
} from "~/models/stock.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/login");
  }

  const id = params?.id;

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

export const action = async ({ request, params }: ActionFunctionArgs) => {
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
          quantity as string
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

const ModifyStockTransfer = () => {
  const { stockTransferRequest, stores, statusList } =
    useLoaderData<typeof loader>();
  const { validationErrors, success, notification, permissionError } =
    (useActionData() as ActionReturnTypes) || {};

  useNotification(notification);
  const submit = useSubmit();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = getFormData(event);
    event.preventDefault();
    ActionAlert(
      "Are you sure?",
      "Do you want to progress this Stock Transfer?",
      () => submit(form),
      () => setLoading(false),
      "warning"
    );
  };

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
        onSubmit={handleSubmit}
      >
        <FormHeader
          type="Stock Transfer"
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
            defaultValue={
              stockTransferRequest?.productVariant?.sku || undefined
            }
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
