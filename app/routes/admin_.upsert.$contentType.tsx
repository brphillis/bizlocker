import { useParams } from "@remix-run/react";
import { redirect, type ActionFunctionArgs } from "@remix-run/server-runtime";
import ArticleCategoryUpsert, {
  articleCategoryUpsertAction,
  articleCategoryUpsertLoader,
} from "~/modules/Upsert/ArticleCategoryUpsert";
import BrandUpsert, {
  brandUpsertAction,
  brandUpsertLoader,
} from "~/modules/Upsert/BrandUpsert";
import CampaignUpsert, {
  campaignUpsertAction,
  campaignUpsertLoader,
} from "~/modules/Upsert/CampaignUpsert";
import DepartmentUpsert, {
  departmentUpsertAction,
  departmentUpsertLoader,
} from "~/modules/Upsert/DepartmentUpsert";
import ImageUpsert, {
  imageUpsertAction,
  imageUpsertLoader,
} from "~/modules/Upsert/ImageUpsert";
import OrderUpsert, {
  orderUpsertAction,
  orderUpsertLoader,
} from "~/modules/Upsert/OrderUpsert";
import ProductCategoryUpsert, {
  productCategoryUpsertAction,
  productCategoryUpsertLoader,
} from "~/modules/Upsert/ProductCategoryUpsert";
import ProductSubCategoryUpsert, {
  productSubCategoryUpsertAction,
  productSubCategoryUpsertLoader,
} from "~/modules/Upsert/ProductSubCategoryUpsert";
import ProductUpsert, {
  productUpsertAction,
  productUpsertLoader,
} from "~/modules/Upsert/ProductUpsert";
import PromotionUpsert, {
  promotionUpsertAction,
  promotionUpsertLoader,
} from "~/modules/Upsert/PromotionUpsert";
import StaffUpsert, {
  staffUpsertAction,
  staffUpsertLoader,
} from "~/modules/Upsert/StaffUpsert";
import StockTransferUpsert, {
  stockTransferUpsertAction,
  stockTransferUpsertLoader,
} from "~/modules/Upsert/StockTransferUpsert";
import StoreUpsert, {
  storeUpsertAction,
  storeUpsertLoader,
} from "~/modules/Upsert/StoreUpsert";
import TeamUpsert, {
  teamUpsertAction,
  teamUpsertLoader,
} from "~/modules/Upsert/TeamUpsert";
import UserUpsert, {
  userUpsertAction,
  userUpsertLoader,
} from "~/modules/Upsert/UserUpsert";
import { tokenAuth } from "~/auth.server";
import { STAFF_SESSION_KEY } from "~/session.server";

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
        <ArticleCategoryUpsert asModule={offRouteModules} />
      )}
      {contentType === "brand" && <BrandUpsert asModule={offRouteModules} />}
      {contentType === "campaign" && (
        <CampaignUpsert asModule={offRouteModules} />
      )}
      {contentType === "department" && (
        <DepartmentUpsert asModule={offRouteModules} />
      )}
      {contentType === "image" && <ImageUpsert asModule={offRouteModules} />}
      {contentType === "order" && <OrderUpsert />}
      {contentType === "product" && (
        <ProductUpsert asModule={offRouteModules} />
      )}
      {contentType === "productCategory" && (
        <ProductCategoryUpsert asModule={offRouteModules} />
      )}
      {contentType === "productSubCategory" && (
        <ProductSubCategoryUpsert asModule={offRouteModules} />
      )}
      {contentType === "promotion" && (
        <PromotionUpsert asModule={offRouteModules} />
      )}
      {contentType === "staff" && <StaffUpsert asModule={offRouteModules} />}
      {contentType === "stockTransfer" && (
        <StockTransferUpsert asModule={offRouteModules} />
      )}
      {contentType === "store" && <StoreUpsert asModule={offRouteModules} />}
      {contentType === "team" && <TeamUpsert asModule={offRouteModules} />}
      {contentType === "user" && <UserUpsert asModule={offRouteModules} />}
    </>
  );
};

export default UpsertContent;
