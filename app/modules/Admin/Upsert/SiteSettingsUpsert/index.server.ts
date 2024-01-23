import { validateForm } from "~/utility/validate";
import type { SiteSettings } from "@prisma/client";
import type { PageNotification } from "~/hooks/PageNotification";
import { getSiteSettings, updateSiteSettings } from "~/models/siteSettings";

const validateOptions = {};

export const siteSettingsUpsertLoader = async () => {
  const siteSettings = await getSiteSettings();

  if (!siteSettings) {
    throw new Response(null, {
      status: 404,
      statusText: "Settings Not Found",
    });
  }

  return { siteSettings };
};

export const siteSettingsUpsertAction = async (request: Request) => {
  let notification: PageNotification;

  const { formEntries, formErrors } = validateForm(
    await request.formData(),
    validateOptions,
  );

  const {
    navigationStyle,
    spinnerStyle,
    announcementMessage,
    announcementIsActive,
    announcementEndsAt,
    countdownIsActive,
    maintenanceMessage,
    isUnderMaintenance,
  } = formEntries;

  switch (formEntries._action) {
    case "upsert": {
      if (formErrors) {
        return { serverValidationErrors: formErrors };
      }

      const updateData: Partial<SiteSettings> = {
        navigationStyle: navigationStyle as string,
        spinnerStyle: spinnerStyle as string,
        announcementMessage: announcementMessage as string,
        announcementIsActive: announcementIsActive ? true : false,
        announcementEndsAt: announcementEndsAt as string,
        countdownIsActive: countdownIsActive ? true : false,
        maintenanceMessage: maintenanceMessage as string,
        isUnderMaintenance: isUnderMaintenance ? true : false,
      };

      await updateSiteSettings(updateData);

      notification = {
        type: "success",
        message: "Site Settings Updated",
      };

      return { notification };
    }
  }
};
