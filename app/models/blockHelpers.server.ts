import { searchArticles } from "./articles.server";
import { searchProducts } from "./products.server";

export const getProductsForPage = async (blocks: any) => {
  let products = [];
  for (const block of blocks) {
    if (block.name === "product") {
      const { products: foundProducts } = await getProductsForBlock(
        block.content[0] as ProductBlockContent,
        block.blockOptions
      );
      products.push(foundProducts as unknown as Product[]);
    }
  }
  return products;
};

export const getProductsForBlock = async (
  productBlockContent: ProductBlockContent,
  blockOptions: BlockOptions
) => {
  const { brandId, gender, productCategoryId, productSubCategoryId } =
    productBlockContent || {};
  const { count, sortBy, sortOrder } = blockOptions || {};

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

  const foundProducts = await searchProducts(formDataObject);

  return foundProducts;
};

export const getArticlesForPage = async (blocks: any) => {
  let products = [];
  for (const block of blocks) {
    if (block.name === "article") {
      const { articles: foundArticles } = await getArticlesForBlock(
        block.content[0] as ArticleBlockContent,
        block.blockOptions
      );
      products.push(foundArticles as unknown as Article[]);
    }
  }
  return products;
};

export const getArticlesForBlock = async (
  ArticleBlockContent: ArticleBlockContent,
  blockOptions: BlockOptions
) => {
  const { articleCategoryId } = ArticleBlockContent || {};
  const { count, sortBy, sortOrder } = blockOptions || {};

  const formDataObject: { [key: string]: string } = {};

  formDataObject.isActive = "true";
  formDataObject.articleCategory = articleCategoryId
    ? articleCategoryId.toString()
    : "";
  formDataObject.perPage = count ? count.toString() : "";
  formDataObject.sortBy = sortBy ? sortBy.toString() : "";
  formDataObject.sortOrder = sortOrder ? sortOrder.toString() : "";

  const foundArticles = await searchArticles(formDataObject);

  return foundArticles;
};
