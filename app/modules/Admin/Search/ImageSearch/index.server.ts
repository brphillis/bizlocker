import type { Params } from "@remix-run/react";
import { json } from "@remix-run/node";
import { searchImages } from "~/models/images.server";

export const imageSearchLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const url = new URL(request.url);
  url.searchParams.set("perPage", "12");

  const { images, totalPages } = await searchImages(undefined, url);

  return json({ images, totalPages });
};
