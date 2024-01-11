import { useParams } from "@remix-run/react";
import { redirect, type ActionFunctionArgs } from "@remix-run/server-runtime";
import ArticleCategoryUpsert from "~/modules/Admin/Upsert/ArticleCategoryUpsert";
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
import SiteSettingsUpsert from "~/modules/Admin/Upsert/SiteSettingsUpsert";
import {
  articleCategoryUpsertLoader,
  articleCategoryUpsertAction,
} from "~/modules/Admin/Upsert/ArticleCategoryUpsert/index.server";
import {
  brandUpsertLoader,
  brandUpsertAction,
} from "~/modules/Admin/Upsert/BrandUpsert/index.server";
import {
  campaignUpsertLoader,
  campaignUpsertAction,
} from "~/modules/Admin/Upsert/CampaignUpsert/index.server";
import {
  departmentUpsertLoader,
  departmentUpsertAction,
} from "~/modules/Admin/Upsert/DepartmentUpsert/index.server";
import {
  imageUpsertLoader,
  imageUpsertAction,
} from "~/modules/Admin/Upsert/ImageUpsert/index.server";
import {
  orderUpsertLoader,
  orderUpsertAction,
} from "~/modules/Admin/Upsert/OrderUpsert/index.server";
import {
  productCategoryUpsertLoader,
  productCategoryUpsertAction,
} from "~/modules/Admin/Upsert/ProductCategoryUpsert/index.server";
import {
  productSubCategoryUpsertLoader,
  productSubCategoryUpsertAction,
} from "~/modules/Admin/Upsert/ProductSubCategoryUpsert/index.server";
import {
  productUpsertLoader,
  productUpsertAction,
} from "~/modules/Admin/Upsert/ProductUpsert/index.server";
import {
  promotionUpsertLoader,
  promotionUpsertAction,
} from "~/modules/Admin/Upsert/PromotionUpsert/index.server";
import {
  siteSettingsUpsertLoader,
  siteSettingsUpsertAction,
} from "~/modules/Admin/Upsert/SiteSettingsUpsert/index.server";
import {
  staffUpsertLoader,
  staffUpsertAction,
} from "~/modules/Admin/Upsert/StaffUpsert/index.server";
import {
  stockTransferUpsertLoader,
  stockTransferUpsertAction,
} from "~/modules/Admin/Upsert/StockTransferUpsert/index.server";
import {
  storeUpsertLoader,
  storeUpsertAction,
} from "~/modules/Admin/Upsert/StoreUpsert/index.server";
import {
  teamUpsertLoader,
  teamUpsertAction,
} from "~/modules/Admin/Upsert/TeamUpsert/index.server";
import {
  userUpsertLoader,
  userUpsertAction,
} from "~/modules/Admin/Upsert/UserUpsert/index.server";

export const loader = async ({ request, params }: ActionFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const contentType = params?.contentType;

  switch (contentType) {
    case "articleCategory":
      return await articleCategoryUpsertLoader(request, params);
    case "brand":
      return await brandUpsertLoader(request, params);
    case "campaign":
      return await campaignUpsertLoader(request, params);
    case "department":
      return await departmentUpsertLoader(request, params);
    case "image":
      return await imageUpsertLoader(request, params);
    case "order":
      return await orderUpsertLoader(request, params);
    case "product":
      return await productUpsertLoader(request, params);
    case "productCategory":
      return await productCategoryUpsertLoader(request, params);
    case "productSubCategory":
      return await productSubCategoryUpsertLoader(request, params);
    case "promotion":
      return await promotionUpsertLoader(request, params);
    case "siteSettings":
      return await siteSettingsUpsertLoader(request, params);
    case "staff":
      return await staffUpsertLoader(request, params);
    case "stockTransfer":
      return await stockTransferUpsertLoader(request, params);
    case "store":
      return await storeUpsertLoader(request, params);
    case "team":
      return await teamUpsertLoader(request, params);
    case "user":
      return await userUpsertLoader(request, params);
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
      return await articleCategoryUpsertAction(request, params);
    case "brand":
      return await brandUpsertAction(request, params);
    case "campaign":
      return await campaignUpsertAction(request, params);
    case "department":
      return await departmentUpsertAction(request, params);
    case "image":
      return await imageUpsertAction(request, params);
    case "order":
      return await orderUpsertAction(request, params);
    case "product":
      return await productUpsertAction(request, params);
    case "productCategory":
      return await productCategoryUpsertAction(request, params);
    case "productSubCategory":
      return await productSubCategoryUpsertAction(request, params);
    case "promotion":
      return await promotionUpsertAction(request, params);
    case "siteSettings":
      return await siteSettingsUpsertAction(request, params);
    case "staff":
      return await staffUpsertAction(request, params);
    case "stockTransfer":
      return await stockTransferUpsertAction(request, params);
    case "store":
      return await storeUpsertAction(request, params);
    case "team":
      return await teamUpsertAction(request, params);
    case "user":
      return await userUpsertAction(request, params);
  }
};

type Props = {
  offRouteModules?: boolean;
};

const UpsertContent = ({ offRouteModules }: Props) => {
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
      {contentType === "siteSettings" && <SiteSettingsUpsert />}
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
