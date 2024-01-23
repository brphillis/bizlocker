import { json } from "@remix-run/node";
import { searchWebPages } from "~/models/WebPages/index.server";

export const pageSearchLoader = async (request: Request) => {
  const url = new URL(request.url);

  const { webPages, totalPages } = await searchWebPages(undefined, url);

  return json({ webPages, totalPages });
};
