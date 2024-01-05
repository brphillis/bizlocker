import { useParams } from "@remix-run/react";
import { redirect, type ActionFunctionArgs } from "@remix-run/server-runtime";
import { tokenAuth } from "~/auth.server";
import { STAFF_SESSION_KEY } from "~/session.server";
import UserSearch, {
  userSearchLoader,
} from "~/modules/Admin/Search/UserSearch";
import ProductSearch, {
  productSearchLoader,
} from "~/modules/Admin/Search/ProductSearch";
import PromotionSearch, {
  promotionSearchLoader,
} from "~/modules/Admin/Search/PromotionSearch";
import ProductCategorySearch, {
  productCategorySearchLoader,
} from "~/modules/Admin/Search/ProductCategorySearch";
import ProductSubCategorySearch, {
  productSubCategorySearchLoader,
} from "~/modules/Admin/Search/ProductSubCategorySearch";
import ImageSearch, {
  imageSearchLoader,
} from "~/modules/Admin/Search/ImageSearch";
import BrandSearch, {
  brandSearchLoader,
} from "~/modules/Admin/Search/BrandSearch";
import TeamSearch, {
  teamSearchLoader,
} from "~/modules/Admin/Search/TeamSearch";
import StoreSearch, {
  storeSearchLoader,
} from "~/modules/Admin/Search/StoreSearch";
import StaffSearch, {
  staffSearchLoader,
} from "~/modules/Admin/Search/StaffSearch";
import StockTransferSearch, {
  stockTransferSearchLoader,
} from "~/modules/Admin/Search/StockTransferSearch";
import CampaignSearch, {
  campaignSearchLoader,
} from "~/modules/Admin/Search/CampaignSearch";
import DepartmentSearch, {
  departmentSearchLoader,
} from "~/modules/Admin/Search/DepartmentSearch";
import ArticleSearch, {
  articleSearchLoader,
} from "~/modules/Admin/Search/ArticleSearch";
import OrderSearch, {
  orderSearchLoader,
} from "~/modules/Admin/Search/OrderSearch";
import ArticleCategorySearch, {
  articleCategorySearchLoader,
} from "~/modules/Admin/Search/ArticleCategorySearch";
import PageSearch, {
  pageSearchLoader,
} from "~/modules/Admin/Search/PageSearch";

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
