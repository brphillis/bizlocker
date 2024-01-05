import { useParams } from "@remix-run/react";
import { redirect, type ActionFunctionArgs } from "@remix-run/server-runtime";
import { tokenAuth } from "~/auth.server";
import { STAFF_SESSION_KEY } from "~/session.server";
import TeamAddStaff, {
  teamAddStaffAction,
  teamAddStaffLoader,
} from "~/modules/Admin/Upsert/TeamUpsert/TeamAddStaff";
import ProductStock, {
  productStockLoader,
} from "~/modules/Admin/Upsert/ProductUpsert/ProductStock";
import ProductStockTransfer, {
  productStockTransferAction,
  productStockTransferLoader,
} from "~/modules/Admin/Upsert/ProductUpsert/ProductStock/ProductStockTransfer";

export const loader = async ({ request, params }: ActionFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const module = params?.module;

  switch (module) {
    case "addStaff":
      return await teamAddStaffLoader(request, params);
    case "productStock":
      return await productStockLoader(request, params);
    case "productStockTransfer":
      return await productStockTransferLoader(request, params);
  }
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const module = params?.module;

  switch (module) {
    case "addStaff":
      return await teamAddStaffAction(request, params);
    case "productStockTransfer":
      return await productStockTransferAction(request, params);
  }
};

const UpsertContent = () => {
  const { module } = useParams();
  return (
    <>
      {module === "addStaff" && <TeamAddStaff />}
      {module === "productStock" && <ProductStock />}
      {module === "productStockTransfer" && <ProductStockTransfer />}
    </>
  );
};

export default UpsertContent;
