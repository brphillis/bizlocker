import { HomePage } from "@prisma/client";
import { BlockContentWithDetails } from "../Blocks/types";
import { Page } from "../PageBuilder/types";

export interface HomePageWithContent extends HomePage {
  blocks?: BlockContentWithDetails[] | null;
  previewPage?: Page[] | null;
}
