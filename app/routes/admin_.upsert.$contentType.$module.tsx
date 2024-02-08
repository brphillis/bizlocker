import { useParams } from "@remix-run/react";
import { redirect, type ActionFunctionArgs } from "@remix-run/server-runtime";
import { tokenAuth } from "~/auth.server";
import { STAFF_SESSION_KEY } from "~/session.server";
import TeamAddStaff from "~/modules/Admin/Upsert/TeamUpsert/TeamAddStaff";
import ProductStock from "~/modules/Admin/Upsert/ProductUpsert/ProductStock";
import ProductStockTransfer from "~/modules/Admin/Upsert/ProductUpsert/ProductStock/ProductStockTransfer";
import {
  teamAddStaffAction,
  teamAddStaffLoader,
} from "~/modules/Admin/Upsert/TeamUpsert/TeamAddStaff/index.server";
import { productStockLoader } from "~/modules/Admin/Upsert/ProductUpsert/ProductStock/index.server";
import {
  productStockTransferAction,
  productStockTransferLoader,
} from "~/modules/Admin/Upsert/ProductUpsert/ProductStock/ProductStockTransfer/index.server";
import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "CLUTCH | Admin Portal" },
    {
      name: "description",
      content: "Clutch Clothing Administration Portal",
    },
  ];
};

export const loader = async ({ request, params }: ActionFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const module = params?.module;

  switch (module) {
    case "add-staff":
      return await teamAddStaffLoader(request, params);
    case "product-stock":
      return await productStockLoader(request);
    case "product-stock-transfer":
      return await productStockTransferLoader(request);
  }
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const module = params?.module;

  switch (module) {
    case "add-staff":
      return await teamAddStaffAction(request);
    case "product-stock-transfer":
      return await productStockTransferAction(request);
  }
};

const UpsertContent = () => {
  const { module } = useParams();
  let moduleComponent;

  switch (module) {
    case "add-staff":
      moduleComponent = <TeamAddStaff />;
      break;
    case "product-stock":
      moduleComponent = <ProductStock />;
      break;
    case "product-stock-transfer":
      moduleComponent = <ProductStockTransfer />;
      break;
    default:
      moduleComponent = null;
      break;
  }

  return <>{moduleComponent}</>;
};

export default UpsertContent;
