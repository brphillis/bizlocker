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
import { dropshipSearchLoader } from "~/modules/Admin/Search/DropShipSearch/index.server";
import DropshipSearch from "~/modules/Admin/Search/DropShipSearch";
import { MetaFunction } from "@remix-run/node";
import { cartSearchLoader } from "~/modules/Admin/Search/CartSearch/index.server";
import CartSearch from "~/modules/Admin/Search/CartSearch";

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

  const contentType = params?.contentType;

  switch (contentType) {
    case "article":
      return await articleSearchLoader(request);
    case "article-category":
      return await articleCategorySearchLoader(request);
    case "brand":
      return await brandSearchLoader(request);
    case "campaign":
      return await campaignSearchLoader(request);
    case "cart":
      return await cartSearchLoader(request);
    case "department":
      return await departmentSearchLoader(request);
    case "dropship":
      return await dropshipSearchLoader(request);
    case "image":
      return await imageSearchLoader(request);
    case "order":
      return await orderSearchLoader(request);
    case "page":
      return await pageSearchLoader(request);
    case "product":
      return await productSearchLoader(request);
    case "product-category":
      return await productCategorySearchLoader(request);
    case "product-subcategory":
      return await productSubCategorySearchLoader(request);
    case "promotion":
      return await promotionSearchLoader(request);
    case "team":
      return await teamSearchLoader(request);
    case "staff":
      return await staffSearchLoader(request);
    case "stock-transfer":
      return await stockTransferSearchLoader(request);
    case "store":
      return await storeSearchLoader(request);
    case "user":
      return await userSearchLoader(request);
  }
};

const SearchContent = () => {
  const { contentType } = useParams();
  let searchComponent;

  switch (contentType) {
    case "article":
      searchComponent = <ArticleSearch />;
      break;
    case "article-category":
      searchComponent = <ArticleCategorySearch />;
      break;
    case "brand":
      searchComponent = <BrandSearch />;
      break;
    case "campaign":
      searchComponent = <CampaignSearch />;
      break;
    case "cart":
      searchComponent = <CartSearch />;
      break;
    case "department":
      searchComponent = <DepartmentSearch />;
      break;
    case "dropship":
      searchComponent = <DropshipSearch />;
      break;
    case "image":
      searchComponent = <ImageSearch />;
      break;
    case "order":
      searchComponent = <OrderSearch />;
      break;
    case "page":
      searchComponent = <PageSearch />;
      break;
    case "product":
      searchComponent = <ProductSearch />;
      break;
    case "product-category":
      searchComponent = <ProductCategorySearch />;
      break;
    case "product-subcategory":
      searchComponent = <ProductSubCategorySearch />;
      break;
    case "promotion":
      searchComponent = <PromotionSearch />;
      break;
    case "staff":
      searchComponent = <StaffSearch />;
      break;
    case "stocktransfer":
      searchComponent = <StockTransferSearch />;
      break;
    case "store":
      searchComponent = <StoreSearch />;
      break;
    case "team":
      searchComponent = <TeamSearch />;
      break;
    case "user":
      searchComponent = <UserSearch />;
      break;
    default:
      searchComponent = null;
      break;
  }

  return <>{searchComponent}</>;
};

export default SearchContent;
