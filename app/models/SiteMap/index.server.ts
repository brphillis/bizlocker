import { SiteMap } from "@prisma/client";
import { prisma } from "../../db.server";

export const getSiteMap = async (): Promise<SiteMap | null> => {
  return await prisma.siteMap.findFirst();
};
