import { prisma } from "~/db.server";
import { Prisma } from "@prisma/client";
import { PreviewPageWithContent } from "../PreviewPage/types";

// our generic page type
export interface Page extends PreviewPageWithContent {
  previewPage?: PreviewPageWithContent[] | null;
}

export type PreviewPageUpdateQuery = Prisma.Args<
  typeof prisma.previewPage,
  "update"
>["data"];

export type PreviewPageCreateQuery = Prisma.Args<
  typeof prisma.previewPage,
  "create"
>["data"];

export type PreviewPageUpsertQuery = Prisma.Args<
  typeof prisma.previewPage,
  "upsert"
>["update"];
