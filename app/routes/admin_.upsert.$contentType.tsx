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
import {
  dropshipProductUpsertAction,
  dropshipProductUpsertLoader,
} from "~/modules/Admin/Upsert/DropshipProductUpsert/index.server";
import DropshipProductUpsert from "~/modules/Admin/Upsert/DropshipProductUpsert";
import {
  taskUpsertLoader,
  tasksUpsertAction,
} from "~/modules/Admin/Upsert/TasksUpsert/index.server";
import TasksUpsert from "~/modules/Admin/Upsert/TasksUpsert";

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
    case "dropshipProduct":
      return await dropshipProductUpsertLoader(request);
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
    case "siteSettings":
      return await siteSettingsUpsertLoader();
    case "staff":
      return await staffUpsertLoader(request);
    case "stockTransfer":
      return await stockTransferUpsertLoader(request);
    case "store":
      return await storeUpsertLoader(request);
    case "task":
      return await taskUpsertLoader();
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
    case "dropshipProduct":
      return await dropshipProductUpsertAction(request);
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
    case "siteSettings":
      return await siteSettingsUpsertAction(request);
    case "staff":
      return await staffUpsertAction(request);
    case "stockTransfer":
      return await stockTransferUpsertAction(request);
    case "store":
      return await storeUpsertAction(request);
    case "task":
      return await tasksUpsertAction(request);
    case "team":
      return await teamUpsertAction(request);
    case "user":
      return await userUpsertAction(request);
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
      {contentType === "dropshipProduct" && (
        <DropshipProductUpsert offRouteModule={offRouteModules} />
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
      {contentType === "task" && <TasksUpsert />}
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
