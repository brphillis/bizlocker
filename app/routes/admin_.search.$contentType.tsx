import { useParams } from "@remix-run/react";
import { redirect, type ActionFunctionArgs } from "@remix-run/server-runtime";
import { tokenAuth } from "~/auth.server";
import { STAFF_SESSION_KEY } from "~/session.server";
import UserSearch from "~/modules/Admin/Search/UserSearch";
import ProductSearch from "~/modules/Admin/Search/ProductSearch";
import PromotionSearch from "~/modules/Admin/Search/PromotionSearch";
import ProductCategorySearch from "~/modules/Admin/Search/ProductCategorySearch";
import ProductSubCategorySearch from "~/modules/Admin/Search/ProductSubCategorySearch";
import ImageSearch from "~/modules/Admin/Search/ImageSearch";
import BrandSearch from "~/modules/Admin/Search/BrandSearch";
import TeamSearch from "~/modules/Admin/Search/TeamSearch";
import StoreSearch from "~/modules/Admin/Search/StoreSearch";
import StaffSearch from "~/modules/Admin/Search/StaffSearch";
import StockTransferSearch from "~/modules/Admin/Search/StockTransferSearch";
import CampaignSearch from "~/modules/Admin/Search/CampaignSearch";
import DepartmentSearch from "~/modules/Admin/Search/DepartmentSearch";
import ArticleSearch from "~/modules/Admin/Search/ArticleSearch";
import OrderSearch from "~/modules/Admin/Search/OrderSearch";
import ArticleCategorySearch from "~/modules/Admin/Search/ArticleCategorySearch";
import PageSearch from "~/modules/Admin/Search/PageSearch";
import { articleCategorySearchLoader } from "~/modules/Admin/Search/ArticleCategorySearch/index.server";
import { articleSearchLoader } from "~/modules/Admin/Search/ArticleSearch/index.server";
import { brandSearchLoader } from "~/modules/Admin/Search/BrandSearch/index.server";
import { campaignSearchLoader } from "~/modules/Admin/Search/CampaignSearch/index.server";
import { departmentSearchLoader } from "~/modules/Admin/Search/DepartmentSearch/index.server";
import { imageSearchLoader } from "~/modules/Admin/Search/ImageSearch/index.server";
import { orderSearchLoader } from "~/modules/Admin/Search/OrderSearch/index.server";
import { pageSearchLoader } from "~/modules/Admin/Search/PageSearch/index.server";
import { productCategorySearchLoader } from "~/modules/Admin/Search/ProductCategorySearch/index.server";
import { productSearchLoader } from "~/modules/Admin/Search/ProductSearch/index.server";
import { productSubCategorySearchLoader } from "~/modules/Admin/Search/ProductSubCategorySearch/index.server";
import { promotionSearchLoader } from "~/modules/Admin/Search/PromotionSearch/index.server";
import { staffSearchLoader } from "~/modules/Admin/Search/StaffSearch/index.server";
import { stockTransferSearchLoader } from "~/modules/Admin/Search/StockTransferSearch/index.server";
import { storeSearchLoader } from "~/modules/Admin/Search/StoreSearch/index.server";
import { teamSearchLoader } from "~/modules/Admin/Search/TeamSearch/index.server";
import { userSearchLoader } from "~/modules/Admin/Search/UserSearch/index.server";

export const loader = async ({ request, params }: ActionFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const contentType = params?.contentType;

  switch (contentType) {
    case "article":
      return await articleSearchLoader(request, params);
    case "articleCategory":
      return await articleCategorySearchLoader(request, params);
    case "brand":
      return await brandSearchLoader(request, params);
    case "campaign":
      return await campaignSearchLoader(request, params);
    case "department":
      return await departmentSearchLoader(request, params);
    case "image":
      return await imageSearchLoader(request, params);
    case "order":
      return await orderSearchLoader(request, params);
    case "page":
      return await pageSearchLoader(request, params);
    case "product":
      return await productSearchLoader(request, params);
    case "productCategory":
      return await productCategorySearchLoader(request, params);
    case "productSubCategory":
      return await productSubCategorySearchLoader(request, params);
    case "promotion":
      return await promotionSearchLoader(request, params);
    case "team":
      return await teamSearchLoader(request, params);
    case "staff":
      return await staffSearchLoader(request, params);
    case "stockTransfer":
      return await stockTransferSearchLoader(request, params);
    case "store":
      return await storeSearchLoader(request, params);
    case "user":
      return await userSearchLoader(request, params);
  }
};

const SearchContent = () => {
  const { contentType } = useParams();
  return (
    <>
      {contentType === "article" && <ArticleSearch />}
      {contentType === "articleCategory" && <ArticleCategorySearch />}
      {contentType === "brand" && <BrandSearch />}
      {contentType === "campaign" && <CampaignSearch />}
      {contentType === "department" && <DepartmentSearch />}
      {contentType === "image" && <ImageSearch />}
      {contentType === "order" && <OrderSearch />}
      {contentType === "page" && <PageSearch />}
      {contentType === "product" && <ProductSearch />}
      {contentType === "productCategory" && <ProductCategorySearch />}
      {contentType === "productSubCategory" && <ProductSubCategorySearch />}
      {contentType === "promotion" && <PromotionSearch />}
      {contentType === "staff" && <StaffSearch />}
      {contentType === "stockTransfer" && <StockTransferSearch />}
      {contentType === "store" && <StoreSearch />}
      {contentType === "team" && <TeamSearch />}
      {contentType === "user" && <UserSearch />}
    </>
  );
};

export default SearchContent;
