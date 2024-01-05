import type {
  Article,
  ArticleCategory,
  Block,
  BlockOptions,
  Gender,
  Product,
  ProductCategory,
  ProductSubCategory,
} from "@prisma/client";
import { searchArticles, type ArticleWithContent } from "./articles.server";
import { searchProducts, type ProductWithDetails } from "./products.server";
import type { ImageWithDetails } from "./images.server";
import type { StoreWithDetails } from "./stores.server";
import type { BlockWithContent } from "./pageBuilder.server";
import type { PromotionWithContent } from "./promotions.server";
import type { CampaignWithContent } from "./campaigns.server";
import type { BrandWithContent } from "./brands.server";

export interface BlockWithBlockOptions extends Block {
  blockOptions: BlockOptions;
}

export interface BlockContentWithDetails {
  id: number;
  articleCategory?: ArticleCategory[] | null;
  gender?: Gender[] | Gender;
  productSubCategory?: ProductSubCategory[] | null;
  block?: BlockWithContent | null;
  brand?: BrandWithContent[] | null;
  campaign?: CampaignWithContent[] | null;
  product: ProductWithDetails[] | null;
  productCategory?: ProductCategory[] | null;
  richText?: string;
  emptyItem?: string[];
  promotion?: PromotionWithContent[] | null;
  image?: ImageWithDetails[] | null;
  article?: ArticleWithContent[] | null;
  store?: StoreWithDetails[] | null;
  icon?: string[];
}

export const fetchBlockProducts = async (
  block: BlockWithContent
): Promise<Product[] | null> => {
  const brandId = block.content.brand?.[0].id;
  const productCategoryId = block.content.productCategory?.[0].id;
  const productSubCategoryId = block.content.productSubCategory?.[0].id;
  const gender = block.content.gender?.[0];

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
  block: BlockWithContent
): Promise<Article[]> => {
  const articleCategoryId = block.content.articleCategory?.[0].id;

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
