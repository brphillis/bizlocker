import { PreviewPage } from "@prisma/client";
import { HomePageWithContent } from "../HomePage/types";
import { ArticleWithContent } from "../Articles/types";
import { ArticleCategoryWithDetails } from "../ArticleCategories/types";
import { ImageWithDetails } from "../Images/types";
import { BlockWithContent } from "../Blocks/types";
import { WebPageWithContent } from "../WebPages/types";

export interface PreviewPageWithContent extends PreviewPage {
  blocks?: BlockWithContent[] | null;
  webPage?: WebPageWithContent | null;
  homePage?: HomePageWithContent | null;
  article?: ArticleWithContent | null;
  articleCategories?: ArticleCategoryWithDetails[] | null;
  thumbnail?: ImageWithDetails | null;
}
