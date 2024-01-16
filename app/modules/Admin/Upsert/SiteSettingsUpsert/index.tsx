import { type FormEvent, useState } from "react";
import { validateForm } from "~/utility/validate";
import { getFormData } from "~/helpers/formHelpers";
import BasicInput from "~/components/Forms/Input/BasicInput";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import BasicToggle from "~/components/Forms/Toggle/BasicToggle";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import AdminPageWrapper from "~/components/Layout/Wrappers/AdminPageWrapper";
import {
  Form,
  Outlet,
  useLoaderData,
  useParams,
  useSubmit,
  useActionData,
} from "@remix-run/react";
import WindowContainer, {
  handleWindowedFormData,
} from "~/components/Layout/Containers/WindowContainer";
import useNotification from "~/hooks/PageNotification";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import type { siteSettingsUpsertLoader } from "./index.server";

const validateOptions = {};

const SiteSettingsUpsert = () => {
  const { siteSettings } = useLoaderData<typeof siteSettingsUpsertLoader>();
  const { notification } = (useActionData() as ActionReturnTypes) || {};

  const {
    navigationStyle,
    spinnerStyle,
    announcementMessage,
    announcementIsActive,
    announcementEndsAt,
    countdownIsActive,
    maintenanceMessage,
    isUnderMaintenance,
  } = siteSettings;

  const submit = useSubmit();
  const { contentType } = useParams();
  useNotification(notification);

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    let form = getFormData(event);
    event.preventDefault();

    form = handleWindowedFormData(form);

    const { formErrors } = validateForm(new FormData(form), validateOptions);
    if (formErrors) {
      setLoading(false);
      return;
    }

    submit(form, {
      method: "POST",
      action: `/admin/upsert/${contentType}`,
    });
  };

  return (
    <AdminPageWrapper>
      <Form
        method="POST"
        onSubmit={handleSubmit}
        className="relative h-max min-h-full w-full p-6"
      >
        <AdminPageHeader title="Site Settings" />

        <div className="flex flex-col gap-3">
          <WindowContainer
            title="Navigation"
            extendStyle="bg-base-200"
            extendTitleBarStyle="!bg-base-500"
            hideClose={true}
            children={
              <div className="relative flex flex-row items-end gap-6 max-md:gap-3">
                <BasicSelect
                  name="navigationStyle"
                  label="Navigation Style"
                  selections={[
                    { id: "productBasic", name: "Product Basic" },
                    { id: "productMegaMenu", name: "Product MegaMenu" },
                  ]}
                  placeholder="Navigation Style"
                  defaultValue={navigationStyle}
                />

                <BasicSelect
                  name="spinnerStyle"
                  label="Loading Spinner Style"
                  selections={[
                    { id: "circle", name: "Circle" },
                    { id: "shirt", name: "Shirt" },
                  ]}
                  placeholder="Spinner Style"
                  defaultValue={spinnerStyle}
                />
              </div>
            }
          />

          <WindowContainer
            title="Announcement"
            extendStyle="bg-base-200"
            extendTitleBarStyle="!bg-base-500"
            hideClose={true}
            children={
              <div className="relative flex flex-col items-start gap-3">
                <div className="relative flex flex-row items-end gap-6 max-md:gap-3">
                  <BasicInput
                    name="announcementMessage"
                    label="Announcement Message"
                    placeholder="Announcement Message"
                    type="text"
                    defaultValue={announcementMessage}
                  />

                  <BasicInput
                    name="announcementEndsAt"
                    label="Announcement End"
                    placeholder="Announcement End"
                    type="date"
                    defaultValue={announcementEndsAt}
                  />
                </div>

                <div className="relative flex flex-col items-start">
                  <BasicToggle
                    label="Announcement Active"
                    name="announcementIsActive"
                    size="sm"
                    defaultValue={announcementIsActive}
                  />

                  <BasicToggle
                    label="Countdown Active"
                    name="countdownIsActive"
                    size="sm"
                    defaultValue={countdownIsActive || false}
                  />
                </div>
              </div>
            }
          />

          <WindowContainer
            title="Announcement"
            extendStyle="bg-base-200"
            extendTitleBarStyle="!bg-base-500"
            hideClose={true}
            children={
              <div className="relative flex flex-col items-start gap-3">
                <div className="relative flex flex-row items-end gap-6 max-md:gap-3">
                  <BasicInput
                    name="maintenanceMessage"
                    label="Maintenance Message"
                    placeholder="Maintenance Message"
                    type="text"
                    defaultValue={maintenanceMessage}
                  />
                </div>

                <div className="relative flex flex-col items-start">
                  <BasicToggle
                    label="Under Maintenance"
                    name="isUnderMaintenance"
                    size="sm"
                    defaultValue={isUnderMaintenance || false}
                  />
                </div>
              </div>
            }
          />
        </div>

        <BackSubmitButtons
          loading={loading}
          setLoading={setLoading}
          hideBack={true}
        />
      </Form>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default SiteSettingsUpsert;
