import { Form, Outlet, type Params } from "@remix-run/react";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import BasicInput from "~/components/Forms/Input/BasicInput";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import BasicToggle from "~/components/Forms/Toggle/BasicToggle";
import WindowContainer from "~/components/Layout/Containers/WindowContainer";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/Wrappers/AdminPageWrapper";

export const siteSettingsUpsertLoader = async (
  request: Request,
  params: Params<string>
) => {
  return null;
};

const SiteSettingsUpsert = () => {
  // const {} = useLoaderData<typeof siteSettingsUpsertLoader>();

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-max min-h-full w-full p-6">
        <AdminPageHeader title="Site Settings" />

        <div className="flex flex-col gap-3">
          <WindowContainer
            label="Navigation"
            direction="col"
            extendStyle="bg-base-200"
            children={
              <div className="relative flex flex-row items-end gap-6 max-md:gap-3">
                <BasicSelect
                  name="navigationStyle"
                  label="Navigation Style"
                  selections={[{ id: "default", name: "Default" }]}
                  placeholder="Navigation Style"
                />

                <BasicSelect
                  name="spinnerStyle"
                  label="Loading Spinner Style"
                  selections={[{ id: "default", name: "Default" }]}
                  placeholder="Spinner Style"
                />
              </div>
            }
          />

          <WindowContainer
            label="Announcement"
            direction="col"
            extendStyle="bg-base-200"
            children={
              <>
                <div className="relative flex flex-row items-end gap-6 max-md:gap-3">
                  <BasicInput
                    name="announcementMessage"
                    label="Announcement Message"
                    placeholder="Announcement Message"
                    type="text"
                  />

                  <BasicInput
                    name="announcementEnd"
                    label="Announcement End"
                    placeholder="Announcement End"
                    type="date"
                  />
                </div>

                <div className="relative flex flex-row items-end gap-6 max-md:gap-3">
                  <BasicToggle
                    label="Announcement Active"
                    name="announcementIsActive"
                    size="sm"
                    value={true}
                  />

                  <BasicToggle
                    label="Countdown Active"
                    name="announcementCountdownIsActive"
                    size="sm"
                    value={true}
                  />
                </div>
              </>
            }
          />
        </div>

        <BackSubmitButtons hideBack={true} />
      </Form>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default SiteSettingsUpsert;
