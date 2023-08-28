import { type LoaderArgs, json } from "@remix-run/node";
import { searchWebPages } from "~/models/webPages.server";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const formData: { [key: string]: FormDataEntryValue } = {};
  searchParams.forEach((value, key) => {
    formData[key] = value;
  });

  const pages = await searchWebPages(formData);
  return json(pages);
};
