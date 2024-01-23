import { ArticleCategory, BlockContent, PreviewPage } from "@prisma/client";
import { ArticleWithContent } from "../Articles/types";
import { ProductCategoryWithDetails } from "../ProductCategories/types";

export interface ArticleCategoryWithDetails extends ArticleCategory {
  blockContent?: BlockContent[] | null;
  articles?: ArticleWithContent[] | null;
  previewPages?: PreviewPage[] | null;
  productCategory?: ProductCategoryWithDetails | null;
}
