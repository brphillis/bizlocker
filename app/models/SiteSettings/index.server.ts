import type { SiteSettings } from "@prisma/client";
import { prisma } from "~/db.server";
export type { Brand } from "@prisma/client";

export const getSiteSettings = async (): Promise<SiteSettings | null> => {
  let existingSiteSettings = await prisma.siteSettings.findFirst({});

  if (!existingSiteSettings) {
    existingSiteSettings = await prisma.siteSettings.create({});
  }

  return existingSiteSettings;
};

export const updateSiteSettings = async (
  siteSettings: Partial<SiteSettings>,
) => {
  const existingSettings = await prisma.siteSettings.findFirst({});

  if (existingSettings) {
    return await prisma.siteSettings.update({
      where: { id: existingSettings.id },
      data: { ...siteSettings },
    });
  } else {
    return await prisma.siteSettings.create({
      data: { ...siteSettings },
    });
  }
};
