import { json } from "@remix-run/server-runtime";
import { searchAliExpressDataHub_Product } from "~/integrations/aliexpress/index.server";
import { AliExpressHubSearch_Params } from "~/integrations/aliexpress/types";

export const dropshipSearchLoader = async (request: Request) => {
  const { searchParams } = new URL(request.url);

  const q = searchParams.get("title")!;
  const page = searchParams.get("pageNumber") || "1";

  if (!q) {
    return null;
  }

  const aliDataHubSearchParams: AliExpressHubSearch_Params = {
    q,
    page,
    region: "AU",
    locale: "en_US",
    sort: "salesDesc",
  };

  const products = await searchAliExpressDataHub_Product(
    aliDataHubSearchParams,
  );

  const totalPages = 10;

  return json({ products, totalPages });
};
