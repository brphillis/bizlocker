import { useParams } from "@remix-run/react";
import { redirect, type ActionFunctionArgs } from "@remix-run/server-runtime";
import ArticleCategoryUpsert, {
  articleCategoryUpsertAction,
  articleCategoryUpsertLoader,
} from "~/modules/Admin/Upsert/ArticleCategoryUpsert";
import BrandUpsert, {
  brandUpsertAction,
  brandUpsertLoader,
} from "~/modules/Admin/Upsert/BrandUpsert";
import CampaignUpsert, {
  campaignUpsertAction,
  campaignUpsertLoader,
} from "~/modules/Admin/Upsert/CampaignUpsert";
import DepartmentUpsert, {
  departmentUpsertAction,
  departmentUpsertLoader,
} from "~/modules/Admin/Upsert/DepartmentUpsert";
import ImageUpsert, {
  imageUpsertAction,
  imageUpsertLoader,
} from "~/modules/Admin/Upsert/ImageUpsert";
import OrderUpsert, {
  orderUpsertAction,
  orderUpsertLoader,
} from "~/modules/Admin/Upsert/OrderUpsert";
import ProductCategoryUpsert, {
  productCategoryUpsertAction,
  productCategoryUpsertLoader,
} from "~/modules/Admin/Upsert/ProductCategoryUpsert";
import ProductSubCategoryUpsert, {
  productSubCategoryUpsertAction,
  productSubCategoryUpsertLoader,
} from "~/modules/Admin/Upsert/ProductSubCategoryUpsert";
import ProductUpsert, {
  productUpsertAction,
  productUpsertLoader,
} from "~/modules/Admin/Upsert/ProductUpsert";
import PromotionUpsert, {
  promotionUpsertAction,
  promotionUpsertLoader,
} from "~/modules/Admin/Upsert/PromotionUpsert";
import StaffUpsert, {
  staffUpsertAction,
  staffUpsertLoader,
} from "~/modules/Admin/Upsert/StaffUpsert";
import StockTransferUpsert, {
  stockTransferUpsertAction,
  stockTransferUpsertLoader,
} from "~/modules/Admin/Upsert/StockTransferUpsert";
import StoreUpsert, {
  storeUpsertAction,
  storeUpsertLoader,
} from "~/modules/Admin/Upsert/StoreUpsert";
import TeamUpsert, {
  teamUpsertAction,
  teamUpsertLoader,
} from "~/modules/Admin/Upsert/TeamUpsert";
import UserUpsert, {
  userUpsertAction,
  userUpsertLoader,
} from "~/modules/Admin/Upsert/UserUpsert";
import { tokenAuth } from "~/auth.server";
import { STAFF_SESSION_KEY } from "~/session.server";
import SiteSettingsUpsert, {
  siteSettingsUpsertAction,
  siteSettingsUpsertLoader,
} from "~/modules/Admin/Upsert/SiteSettingsUpsert";

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
