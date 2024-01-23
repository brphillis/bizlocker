import { WebPage } from "@prisma/client";
import { Page } from "../PageBuilder/types";
import { ImageWithDetails } from "../Images/types";
import { BlockWithContent } from "../Blocks/types";

export interface WebPageWithContent extends WebPage {
  blocks?: BlockWithContent[] | null;
  thumbnail?: ImageWithDetails | null;
  previewPage?: Page[] | null;
}
