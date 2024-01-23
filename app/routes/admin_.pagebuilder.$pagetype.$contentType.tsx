import { useParams } from "@remix-run/react";
import { redirect, type ActionFunctionArgs } from "@remix-run/server-runtime";
import {
  articleCategoryUpsertAction,
  articleCategoryUpsertLoader,
} from "~/modules/Admin/Upsert/ArticleCategoryUpsert/index.server";
import BrandUpsert from "~/modules/Admin/Upsert/BrandUpsert";
import CampaignUpsert from "~/modules/Admin/Upsert/CampaignUpsert";
import DepartmentUpsert from "~/modules/Admin/Upsert/DepartmentUpsert";
import ImageUpsert from "~/modules/Admin/Upsert/ImageUpsert";
import OrderUpsert from "~/modules/Admin/Upsert/OrderUpsert";
import ProductCategoryUpsert from "~/modules/Admin/Upsert/ProductCategoryUpsert";
import ProductSubCategoryUpsert from "~/modules/Admin/Upsert/ProductSubCategoryUpsert";
import ProductUpsert from "~/modules/Admin/Upsert/ProductUpsert";
import PromotionUpsert from "~/modules/Admin/Upsert/PromotionUpsert";
import StaffUpsert from "~/modules/Admin/Upsert/StaffUpsert";
import StockTransferUpsert from "~/modules/Admin/Upsert/StockTransferUpsert";
import StoreUpsert from "~/modules/Admin/Upsert/StoreUpsert";
import TeamUpsert from "~/modules/Admin/Upsert/TeamUpsert";
import UserUpsert from "~/modules/Admin/Upsert/UserUpsert";
import { tokenAuth } from "~/auth.server";
import { STAFF_SESSION_KEY } from "~/session.server";
import ArticleCategoryUpsert from "~/modules/Admin/Upsert/ArticleCategoryUpsert";
import {
  brandUpsertAction,
  brandUpsertLoader,
} from "~/modules/Admin/Upsert/BrandUpsert/index.server";
import {
  campaignUpsertAction,
  campaignUpsertLoader,
} from "~/modules/Admin/Upsert/CampaignUpsert/index.server";
import {
  departmentUpsertAction,
  departmentUpsertLoader,
} from "~/modules/Admin/Upsert/DepartmentUpsert/index.server";
import {
  imageUpsertAction,
  imageUpsertLoader,
} from "~/modules/Admin/Upsert/ImageUpsert/index.server";
import {
  orderUpsertAction,
  orderUpsertLoader,
} from "~/modules/Admin/Upsert/OrderUpsert/index.server";
import {
  productUpsertAction,
  productUpsertLoader,
} from "~/modules/Admin/Upsert/ProductUpsert/index.server";
import {
  productCategoryUpsertAction,
  productCategoryUpsertLoader,
} from "~/modules/Admin/Upsert/ProductCategoryUpsert/index.server";
import {
  productSubCategoryUpsertAction,
  productSubCategoryUpsertLoader,
} from "~/modules/Admin/Upsert/ProductSubCategoryUpsert/index.server";
import {
  promotionUpsertAction,
  promotionUpsertLoader,
} from "~/modules/Admin/Upsert/PromotionUpsert/index.server";
import {
  staffUpsertAction,
  staffUpsertLoader,
} from "~/modules/Admin/Upsert/StaffUpsert/index.server";
import {
  stockTransferUpsertAction,
  stockTransferUpsertLoader,
} from "~/modules/Admin/Upsert/StockTransferUpsert/index.server";
import {
  storeUpsertAction,
  storeUpsertLoader,
} from "~/modules/Admin/Upsert/StoreUpsert/index.server";
import {
  teamUpsertAction,
  teamUpsertLoader,
} from "~/modules/Admin/Upsert/TeamUpsert/index.server";
import {
  userUpsertAction,
  userUpsertLoader,
} from "~/modules/Admin/Upsert/UserUpsert/index.server";

export const loader = async ({ request, params }: ActionFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const contentType = params?.contentType;

  switch (contentType) {
    case "articleCategory":
      return await articleCategoryUpsertLoader(request);
    case "brand":
      return await brandUpsertLoader(request);
    case "campaign":
      return await campaignUpsertLoader(request);
    case "department":
      return await departmentUpsertLoader(request);
    case "image":
      return await imageUpsertLoader(request);
    case "order":
      return await orderUpsertLoader(request);
    case "product":
      return await productUpsertLoader(request);
    case "productCategory":
      return await productCategoryUpsertLoader(request);
    case "productSubCategory":
      return await productSubCategoryUpsertLoader(request);
    case "promotion":
      return await promotionUpsertLoader(request);
    case "staff":
      return await staffUpsertLoader(request);
    case "stockTransfer":
      return await stockTransferUpsertLoader(request);
    case "store":
      return await storeUpsertLoader(request);
    case "team":
      return await teamUpsertLoader(request);
    case "user":
      return await userUpsertLoader(request);
  }
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const contentType = params?.contentType;

  switch (contentType) {
    case "articleCategory":
      return await articleCategoryUpsertAction(request);
    case "brand":
      return await brandUpsertAction(request);
    case "campaign":
      return await campaignUpsertAction(request, params);
    case "department":
      return await departmentUpsertAction(request);
    case "image":
      return await imageUpsertAction(request);
    case "order":
      return await orderUpsertAction(request);
    case "product":
      return await productUpsertAction(request);
    case "productCategory":
      return await productCategoryUpsertAction(request);
    case "productSubCategory":
      return await productSubCategoryUpsertAction(request);
    case "promotion":
      return await promotionUpsertAction(request);
    case "staff":
      return await staffUpsertAction(request);
    case "stockTransfer":
      return await stockTransferUpsertAction(request);
    case "store":
      return await storeUpsertAction(request);
    case "team":
      return await teamUpsertAction(request);
    case "user":
      return await userUpsertAction(request);
  }
};

type Props = {
  offRouteModules?: boolean;
};

const UpsertContent = ({ offRouteModules = true }: Props) => {
  const { contentType } = useParams();
  return (
    <>
      {contentType === "articleCategory" && (
        <ArticleCategoryUpsert offRouteModule={offRouteModules} />
      )}
      {contentType === "brand" && (
        <BrandUpsert offRouteModule={offRouteModules} />
      )}
      {contentType === "campaign" && (
        <CampaignUpsert offRouteModule={offRouteModules} />
      )}
      {contentType === "department" && (
        <DepartmentUpsert offRouteModule={offRouteModules} />
      )}
      {contentType === "image" && (
        <ImageUpsert offRouteModule={offRouteModules} />
      )}
      {contentType === "order" && <OrderUpsert />}
      {contentType === "product" && (
        <ProductUpsert offRouteModule={offRouteModules} />
      )}
      {contentType === "productCategory" && (
        <ProductCategoryUpsert offRouteModule={offRouteModules} />
      )}
      {contentType === "productSubCategory" && (
        <ProductSubCategoryUpsert offRouteModule={offRouteModules} />
      )}
      {contentType === "promotion" && (
        <PromotionUpsert offRouteModule={offRouteModules} />
      )}
      {contentType === "staff" && (
        <StaffUpsert offRouteModule={offRouteModules} />
      )}
      {contentType === "stockTransfer" && (
        <StockTransferUpsert offRouteModule={offRouteModules} />
      )}
      {contentType === "store" && (
        <StoreUpsert offRouteModule={offRouteModules} />
      )}
      {contentType === "team" && (
        <TeamUpsert offRouteModule={offRouteModules} />
      )}
      {contentType === "user" && (
        <UserUpsert offRouteModule={offRouteModules} />
      )}
    </>
  );
};

export default UpsertContent;
