import type { Params } from "@remix-run/react";
import { json } from "@remix-run/node";
import { searchWebPages } from "~/models/webPages.server";

export const pageSearchLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const url = new URL(request.url);

  const { webPages, totalPages } = await searchWebPages(undefined, url);

  return json({ webPages, totalPages });
};
