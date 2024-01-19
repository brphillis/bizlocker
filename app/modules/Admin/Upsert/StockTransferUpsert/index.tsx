import { type FormEvent, useEffect, useState } from "react";
import { getFormData } from "~/helpers/formHelpers";
import useNotification from "~/hooks/PageNotification";
import DarkOverlay from "~/components/Layout/Overlays/DarkOverlay";
import { capitalizeFirst } from "~/helpers/stringHelpers";
import BasicInput from "~/components/Forms/Input/BasicInput";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import { ActionAlert } from "~/components/Notifications/Alerts";
import OrderStatusSteps from "~/components/Indicators/OrderStatusSteps";
import { type ValidationErrors, validateForm } from "~/utility/validate";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
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
import type { stockTransferUpsertLoader } from "./index.server";

const validateOptions = {};

type Props = {
  offRouteModule?: boolean;
};

const StockTransferUpsert = ({ offRouteModule }: Props) => {
  const { stockTransferRequest, stores, statusList } =
    useLoaderData<typeof stockTransferUpsertLoader>();
  const { serverValidationErrors, success, notification, permissionError } =
    (useActionData() as ActionReturnTypes) || {};

  const navigate = useNavigate();
  let submit = useSubmit();
  const [searchParams] = useSearchParams();
  const contentId = searchParams.get("contentId");
  const { contentType } = useParams();
  useNotification(notification);

  const [clientValidationErrors, setClientValidationErrors] =
    useState<ValidationErrors>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = getFormData(event);
    event.preventDefault();

    const { formErrors } = validateForm(new FormData(form), validateOptions);
    if (formErrors) {
      setClientValidationErrors(formErrors);
      setLoading(false);
      return;
    }

    ActionAlert(
      "Are you sure?",
      "Do you want to progress this Stock Transfer?",
      () =>
        submit(form, {
          method: "POST",
          action: `/admin/upsert/${contentType}?contentId=${contentId}`,
          navigate: offRouteModule ? false : true,
        }),
      () => setLoading(false),
      "warning",
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
      <WindowContainer
        title="Stock Transfer"
        children={
          <Form
            method="POST"
            onSubmit={handleSubmit}
            className="scrollbar-hide relative w-[500px] max-w-full overflow-y-auto"
          >
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
                    extendContainerStyle="w-full"
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
                extendContainerStyle="w-full"
                disabled={true}
                defaultValue={
                  stockTransferRequest?.productVariant?.sku || undefined
                }
                validationErrors={
                  serverValidationErrors || clientValidationErrors
                }
              />

              <BasicSelect
                label="From Store"
                name="fromStore"
                placeholder="Select a Store"
                extendContainerStyle="w-full"
                selections={stores as unknown as SelectValue[]}
                disabled={true}
                defaultValue={stockTransferRequest.fromStoreId.toString()}
              />

              <BasicSelect
                label="To Store"
                name="toStore"
                placeholder="Select a Store"
                extendContainerStyle="w-full"
                selections={stores as unknown as SelectValue[]}
                disabled={true}
                defaultValue={stockTransferRequest.toStoreId.toString()}
              />

              <BasicInput
                name="quantity"
                label="Quantity"
                placeholder="Quantity"
                type="number"
                extendContainerStyle="w-full"
                disabled={true}
                defaultValue={stockTransferRequest?.quantity || undefined}
                validationErrors={
                  serverValidationErrors || clientValidationErrors
                }
              />

              <BasicInput
                name="trackingNumber"
                label="Tracking Number"
                placeholder="Tracking number"
                type="text"
                extendContainerStyle="w-full"
                disabled={true}
                defaultValue={stockTransferRequest?.trackingNumber || undefined}
                validationErrors={
                  serverValidationErrors || clientValidationErrors
                }
              />

              <BasicInput
                name="createdBy"
                label="Created By"
                placeholder="Created By"
                type="text"
                extendContainerStyle="w-full"
                disabled={true}
                defaultValue={stockTransferRequest?.createdBy || undefined}
                validationErrors={
                  serverValidationErrors || clientValidationErrors
                }
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
        }
      />
    </DarkOverlay>
  );
};

export default StockTransferUpsert;
