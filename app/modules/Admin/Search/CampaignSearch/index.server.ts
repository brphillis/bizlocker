import type { Params } from "@remix-run/react";
import { json } from "@remix-run/node";
import { searchCampaigns } from "~/models/campaigns.server";

export const campaignSearchLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const url = new URL(request.url);

  const { campaigns, totalPages } = await searchCampaigns(undefined, url);

  return json({ campaigns, totalPages });
};
