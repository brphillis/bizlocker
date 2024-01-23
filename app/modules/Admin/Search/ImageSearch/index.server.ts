import { json } from "@remix-run/node";
import { searchImages } from "~/models/Images/index.server";

export const imageSearchLoader = async (request: Request) => {
  const url = new URL(request.url);
  url.searchParams.set("perPage", "12");

  const { images, totalPages } = await searchImages(undefined, url);

  return json({ images, totalPages });
};
