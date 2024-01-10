import { tokenAuth } from "~/auth.server";
import type { Staff } from "@prisma/client";
import {
  Form,
  Outlet,
  type Params,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import DarkOverlay from "~/components/Layout/Overlays/DarkOverlay";
import BasicTitleBar from "~/components/Layout/TitleBars/BasicTitleBar";
import { getUserDataFromSession, STAFF_SESSION_KEY } from "~/session.server";
import { json, redirect } from "@remix-run/node";
import { getProductVariant } from "~/models/products.server";
import { getStores } from "~/models/stores.server";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import BasicInput from "~/components/Forms/Input/BasicInput";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import { useEffect, useState } from "react";
import { type ActionReturnTypes } from "~/utility/actionTypes";
import {
  type NewStockTransferRequest,
  createStockTransferRequest,
} from "~/models/stock.server";
import useNotification, {
  type PageNotification,
} from "~/hooks/PageNotification";
import ValidationErrorsList from "~/components/Forms/Validation/ValidationErrorsList";

export const productStockTransferLoader = async (
  request: Request,
  params: Params<string>
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
  params: Params<string>
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
          <BasicTitleBar title="Stock" />

          <div className="flex flex-col gap-3">
            <BasicInput
              label="Product Name"
              type="text"
              name="productName"
              placeholder="Product Name"
              customWidth="w-full"
              disabled={true}
              defaultValue={variant.product?.name}
            />

            <BasicInput
              label="Variant Name"
              type="text"
              disabled={true}
              name="variantName"
              placeholder="Variant Name"
              customWidth="w-full"
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
              customWidth="w-full"
            />
            <input readOnly hidden value={fromStoreId} name="fromStoreId" />

            <BasicInput
              label="From Store Stock"
              type="number"
              name="fromStoreStockDisabled"
              placeholder="From Store Stock"
              disabled={true}
              customWidth="w-full"
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
              customWidth="w-full"
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
              customWidth="w-full"
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
