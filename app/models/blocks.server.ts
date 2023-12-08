import type {
  Article,
  ArticleCategory,
  Block,
  BlockOptions,
  Brand,
  Gender,
  Product,
  ProductCategory,
  ProductSubCategory,
} from "@prisma/client";
import { searchArticles } from "./articles.server";
import { searchProducts } from "./products.server";
import type { ImageWithDetails } from "./images.server";
import type { StoreWithDetails } from "./stores.server";
import type { PageBlock } from "./pageBuilder.server";
import type { PromotionWithContent } from "./promotions.server";
import type { CampaignWithContent } from "./campaigns.server";

export interface BlockWithBlockOptions extends Block {
  blockOptions: BlockOptions;
}

export interface BlockContent {
  richText?: string;
  productCategory?: ProductCategory[] | ProductCategory;
  productSubCategory?: ProductSubCategory[] | ProductSubCategory;
  articleCategory?: ArticleCategory[] | ArticleCategory;
  gender?: Gender[] | Gender;
  brand?: Brand[] | Brand;
  promotion?: PromotionWithContent[] | PromotionWithContent;
  campaign?: CampaignWithContent[] | CampaignWithContent;
  image?: ImageWithDetails[] | ImageWithDetails;
  product: Product[] | Product | null;
  article?: Article[] | Article;
  store?: StoreWithDetails[] | StoreWithDetails;
  icon?: string[];
  brandId: number;
  productCategoryId: number;
  productSubCategoryId: number;
  articleCategoryId: number;
}

export const fetchBlockProducts = async (
  block: PageBlock
): Promise<Product[] | null> => {
  const { brandId, gender, productCategoryId, productSubCategoryId } =
    block.content || {};

  const { count, sortBy, sortOrder } = block.blockOptions[0] || {};

  const formDataObject: { [key: string]: string } = {};

  formDataObject.isActive = "true";
  formDataObject.productCategory = productCategoryId
    ? productCategoryId.toString()
    : "";
  formDataObject.productSubCategory = productSubCategoryId
    ? productSubCategoryId.toString()
    : "";
  formDataObject.brand = brandId ? brandId.toString() : "";
  formDataObject.gender = gender ? gender.toString() : "";
  formDataObject.perPage = count ? count.toString() : "";
  formDataObject.sortBy = sortBy ? sortBy.toString() : "";
  formDataObject.sortOrder = sortOrder ? sortOrder.toString() : "";

  const { products } = await searchProducts(formDataObject);
  return products;
};

export const fetchBlockArticles = async (
  block: PageBlock
): Promise<Article[]> => {
  const { articleCategoryId } = block.content || {};
  const { count, sortBy, sortOrder } = block.blockOptions[0] || {};

  const formDataObject: { [key: string]: string } = {};

  formDataObject.isActive = "true";
  formDataObject.articleCategory = articleCategoryId
    ? articleCategoryId.toString()
    : "";
  formDataObject.perPage = count ? count.toString() : "";
  formDataObject.sortBy = sortBy ? sortBy.toString() : "";
  formDataObject.sortOrder = sortOrder ? sortOrder.toString() : "";

  const { articles } = await searchArticles(formDataObject);

  return articles;
};
