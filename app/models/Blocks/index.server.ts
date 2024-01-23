import type { Article, Product } from "@prisma/client";
import { searchArticles } from "../Articles/index.server";
import { searchProducts } from "../Products/index.server";
import { sortBlocks } from "~/helpers/blockHelpers";
import { BlockWithContent } from "./types";
import { Page } from "../PageBuilder/types";

export const getBlocks = async (
  page: Page,
  fetchNestedContent?: boolean,
): Promise<BlockWithContent[]> => {
  // Populate the page with the active block types
  const sortedBlocks = sortBlocks(page);

  // Populate content in blocks that requires a search query
  if (fetchNestedContent) {
    for (let i = 0; i < sortedBlocks.length; i++) {
      const block = sortedBlocks[i];
      if (block.name === "product" && block.content) {
        block.content.product = await fetchBlockProducts(block);
      }
      if (block.name === "article" && block.content) {
        block.content.article = await fetchBlockArticles(block);
      }
    }
  }

  return sortedBlocks;
};

export const fetchBlockProducts = async (
  block: BlockWithContent,
): Promise<Product[] | null> => {
  const brandId = block.content?.brand?.[0]?.id;
  const productCategoryId = block.content?.productCategory?.[0]?.id;
  const productSubCategoryId = block.content?.productSubCategory?.[0]?.id;
  const gender = block.content?.gender?.[0];

  const { count, sortBy, sortOrder } = block?.blockOptions?.[0] || {};

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
  block: BlockWithContent,
): Promise<Article[]> => {
  const articleCategoryId = block.content?.articleCategory?.[0].id;

  const { count, sortBy, sortOrder } = block?.blockOptions?.[0] || {};

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
