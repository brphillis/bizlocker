import { json } from "@remix-run/node";
import { searchCampaigns } from "~/models/Campaigns/index.server";

export const campaignSearchLoader = async (request: Request) => {
  const url = new URL(request.url);

  const { campaigns, totalPages } = await searchCampaigns(undefined, url);

  return json({ campaigns, totalPages });
};
