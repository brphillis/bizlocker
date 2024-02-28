import { useEffect, useState } from "react";
import useNotification from "~/hooks/PageNotification";
import BasicInput from "~/components/Forms/Input/BasicInput";
import { type ActionReturnTypes } from "~/utility/actionTypes";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import DarkOverlay from "~/components/Layout/Overlays/DarkOverlay";
import BasicTitleBar from "~/components/Layout/TitleBars/BasicTitleBar";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import ValidationErrorsList from "~/components/Forms/Validation/ValidationErrorsList";
import {
  Form,
  Outlet,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import type { productStockTransferLoader } from "./index.server";

const ProductStockTransfer = () => {
  const { variant, userStoreId, fromStoreId, stores } =
    useLoaderData<typeof productStockTransferLoader>();

  const { validationErrors, success, notification } =
    (useActionData() as ActionReturnTypes) || {};

  const navigate = useNavigate();
  useNotification(notification);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (success) {
      navigate(-1);
    }
  }, [success, navigate]);

  return (
    <>
      <DarkOverlay>
        <Form
          method="POST"
          className="scrollbar-hide relative w-[600px] max-w-full overflow-y-auto bg-base-200 px-3 py-6 sm:px-6"
        >
          <BasicTitleBar title="Stock Transfer Request" />

          <div className="flex flex-col gap-3">
            <BasicInput
              label="Product Name"
              type="text"
              name="productName"
              placeholder="Product Name"
              extendContainerStyle="w-full"
              disabled={true}
              defaultValue={variant.product?.name}
            />

            <BasicInput
              label="Variant Name"
              type="text"
              disabled={true}
              name="variantName"
              placeholder="Variant Name"
              extendContainerStyle="w-full"
              defaultValue={variant.name}
            />
            <input readOnly hidden value={variant.id} name="variantId" />

            <BasicSelect
              selections={stores}
              label="From Store"
              name="fromStoreIdDisabled"
              placeholder="From Store"
              defaultValue={fromStoreId}
              disabled={true}
              extendContainerStyle="w-full"
            />
            <input readOnly hidden value={fromStoreId} name="fromStoreId" />

            <BasicInput
              label="From Store Stock"
              type="number"
              name="fromStoreStockDisabled"
              placeholder="From Store Stock"
              disabled={true}
              extendContainerStyle="w-full"
              value={
                variant.stock?.find((e) => e.storeId === Number(fromStoreId))
                  ?.quantity
              }
            />
            <input
              readOnly
              hidden
              value={
                variant.stock?.find((e) => e.storeId === Number(fromStoreId))
                  ?.quantity
              }
              name="fromStoreStock"
            />

            <BasicSelect
              selections={stores}
              label="To Store"
              name="toStoreIdDisabled"
              placeholder="To Store"
              defaultValue={userStoreId}
              extendContainerStyle="w-full"
              disabled={true}
            />
            <input
              readOnly
              hidden
              value={userStoreId?.toString()}
              name="toStoreId"
            />

            <BasicInput
              label="To Store Stock"
              type="number"
              name="toStoreStock"
              placeholder="To Store Stock"
              extendContainerStyle="w-full"
              defaultValue={0}
            />
          </div>

          <ValidationErrorsList
            validationErrors={validationErrors}
            extendStyle="pt-3"
          />

          <BackSubmitButtons
            loading={loading}
            setLoading={setLoading}
            validationErrors={validationErrors}
          />
        </Form>
      </DarkOverlay>
      <Outlet />
    </>
  );
};

export default ProductStockTransfer;
