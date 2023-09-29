import { searchArticles } from "./articles.server";
import { searchProducts } from "./products.server";

export const fetchBlockProducts = async (block: any) => {
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

export const fetchBlockArticles = async (block: any) => {
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
