import { Article, ArticleCategory, Image, PreviewPage } from "@prisma/client";
import { BlockWithContent } from "../Blocks/types";

export interface ArticleWithContent extends Article {
  articleCategories?: ArticleCategory[] | null;
  blocks?: BlockWithContent[] | null;
  previewPage?: PreviewPage[] | null;
  thumbnail?: Image | null;
}
