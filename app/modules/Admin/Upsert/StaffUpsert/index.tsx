import { type FormEvent, useEffect, useState } from "react";
import { getFormData } from "~/helpers/formHelpers";
import DarkOverlay from "~/components/Layout/Overlays/DarkOverlay";
import BasicButton from "~/components/Buttons/BasicButton";
import BasicInput from "~/components/Forms/Input/BasicInput";
import PhoneInput from "~/components/Forms/Input/PhoneInput";
import { formatDateForFormField } from "~/helpers/dateHelpers";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import UploadAvatar from "~/components/Forms/Upload/UploadAvatar";
import SelectCountry from "~/components/Forms/Select/SelectCountry";
import { type ValidationErrors, validateForm } from "~/utility/validate";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import useNotification from "~/hooks/PageNotification";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
  useSearchParams,
  useParams,
} from "@remix-run/react";
import WindowContainer, {
  handleWindowedFormData,
} from "~/components/Layout/Containers/WindowContainer";
import type { staffUpsertLoader } from "./index.server";
import TabContent from "~/components/Tabs/TabContent";

const validateOptions = {
  email: true,
  firstName: true,
  lastName: true,
  dateofbirth: true,
  phoneNumber: true,
  addressLine1: true,
  postcode: true,
  suburb: true,
  state: true,
  country: true,
  password: false,
};

type Props = {
  offRouteModule?: boolean;
};

const StaffUpsert = ({ offRouteModule }: Props) => {
  const { staffMember, roles, stores, role } =
    useLoaderData<typeof staffUpsertLoader>();
  const { serverValidationErrors, permissionError, success, notification } =
    (useActionData() as ActionReturnTypes) || {};

  const navigate = useNavigate();
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const contentId = searchParams.get("contentId");
  const { contentType } = useParams();
  useNotification(notification);

  const [clientValidationErrors, setClientValidationErrors] =
    useState<ValidationErrors>();
  const [loading, setLoading] = useState<boolean>(false);

  const tabNames = ["general", "address", "staff"];
  const [activeTab, setActiveTab] = useState<string | undefined>(tabNames?.[0]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const [changingPassword, setChangingPassword] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    let form = getFormData(event);
    event.preventDefault();

    form = handleWindowedFormData(form);

    const { formErrors } = validateForm(new FormData(form), validateOptions);
    if (formErrors) {
      setClientValidationErrors(formErrors);
      setLoading(false);
      return;
    }

    submit(form, {
      method: "POST",
      action: `/admin/upsert/${contentType}?contentId=${contentId}`,
      navigate: offRouteModule ? false : true,
    });

    if (offRouteModule) {
      navigate(-1);
    }
  };

  useEffect(() => {
    if (success) {
      navigate(-1);
    }
    if (serverValidationErrors) {
      setLoading(false);
    }
  }, [success, navigate, serverValidationErrors]);

  return (
    <DarkOverlay>
      <WindowContainer
        hasIsActive={true}
        isActive={staffMember?.isActive}
        hasMode={true}
        title="Staff"
        setActiveTab={handleTabChange}
        tabNames={tabNames}
        activeTab={activeTab}
      >
        <Form
          method="POST"
          onSubmit={handleSubmit}
          className="scrollbar-hide relative w-[600px] max-w-full overflow-y-auto"
        >
          <TabContent tab="general" activeTab={activeTab} extendStyle="gap-3">
            <UploadAvatar avatar={staffMember?.avatar} />

            <BasicInput
              name="email"
              label="Email Address"
              placeholder="Email Address"
              type="text"
              extendContainerStyle="w-full"
              defaultValue={staffMember?.email || undefined}
              validationErrors={
                serverValidationErrors || clientValidationErrors
              }
            />

            <BasicInput
              name="firstName"
              label="First Name"
              placeholder="First Name"
              type="text"
              extendContainerStyle="w-full"
              defaultValue={staffMember?.userDetails?.firstName || undefined}
              validationErrors={
                serverValidationErrors || clientValidationErrors
              }
            />

            <BasicInput
              name="lastName"
              label="Last Name"
              placeholder="Last Name"
              type="text"
              extendContainerStyle="w-full"
              defaultValue={staffMember?.userDetails?.lastName || undefined}
              validationErrors={
                serverValidationErrors || clientValidationErrors
              }
            />

            <PhoneInput
              name="phoneNumber"
              label="Phone Number"
              placeholder="Phone Number"
              type="text"
              extendContainerStyle="w-full"
              defaultValue={staffMember?.userDetails?.phoneNumber || undefined}
              validationErrors={
                serverValidationErrors || clientValidationErrors
              }
            />

            <BasicInput
              name="dateofbirth"
              label="Date of Birth"
              placeholder="Date of Birth"
              type="date"
              extendContainerStyle="w-full"
              defaultValue={formatDateForFormField(
                staffMember?.userDetails?.dateOfBirth,
              )}
              validationErrors={
                serverValidationErrors || clientValidationErrors
              }
            />
          </TabContent>

          <TabContent tab="address" activeTab={activeTab} extendStyle="gap-3">
            <BasicInput
              name="addressLine1"
              label="Address Line 1"
              placeholder="Address Line 1"
              type="text"
              extendContainerStyle="w-full"
              defaultValue={staffMember?.address?.addressLine1 || undefined}
              validationErrors={
                serverValidationErrors || clientValidationErrors
              }
            />

            <BasicInput
              name="addressLine2"
              label="Address Line 2"
              placeholder="Address Line 2"
              type="text"
              extendContainerStyle="w-full"
              defaultValue={staffMember?.address?.addressLine2 || undefined}
              validationErrors={
                serverValidationErrors || clientValidationErrors
              }
            />

            <BasicInput
              name="suburb"
              label="Suburb"
              placeholder="Suburb"
              type="text"
              extendContainerStyle="w-full"
              defaultValue={staffMember?.address?.suburb || undefined}
              validationErrors={
                serverValidationErrors || clientValidationErrors
              }
            />

            <BasicInput
              name="postcode"
              label="PostCode"
              placeholder="PostCode"
              type="text"
              extendContainerStyle="w-full"
              defaultValue={staffMember?.address?.postcode || undefined}
              validationErrors={
                serverValidationErrors || clientValidationErrors
              }
            />

            <BasicInput
              name="state"
              label="State"
              placeholder="State"
              type="text"
              extendContainerStyle="w-full"
              defaultValue={staffMember?.address?.state || undefined}
              validationErrors={
                serverValidationErrors || clientValidationErrors
              }
            />

            <SelectCountry
              defaultValue={staffMember?.address?.country}
              validationErrors={
                serverValidationErrors || clientValidationErrors
              }
              extendStyle="!w-full"
            />
          </TabContent>

          <TabContent tab="staff" activeTab={activeTab} extendStyle="gap-3">
            <BasicSelect
              name="role"
              label="Role"
              extendContainerStyle="w-full"
              placeholder="Role"
              selections={roles?.map((e: string) => {
                return { id: e, name: e };
              })}
              defaultValue={staffMember?.role || ""}
            />

            <BasicInput
              name="jobTitle"
              label="Job Title"
              placeholder="Job Title"
              type="text"
              extendContainerStyle="w-full"
              defaultValue={staffMember?.jobTitle || undefined}
              validationErrors={
                serverValidationErrors || clientValidationErrors
              }
            />

            <BasicSelect
              label="Store"
              name="store"
              extendContainerStyle="w-full"
              placeholder="Select a Store"
              selections={stores}
              defaultValue={staffMember?.storeId || ""}
            />

            <>
              {changingPassword &&
                (role === "DEVELOPER" || role === "ADMIN") && (
                  <>
                    <BasicInput
                      name="password"
                      label="Password"
                      placeholder="Password"
                      type="password"
                      extendContainerStyle="w-full"
                      defaultValue={undefined}
                      validationErrors={
                        serverValidationErrors || clientValidationErrors
                      }
                    />

                    <BasicButton
                      label="Cancel Password Change"
                      extendStyle="mt-3 bg-primary text-brand-white hover:bg-primary-dark"
                      onClick={() => setChangingPassword(false)}
                    />
                  </>
                )}

              {!changingPassword && (
                <BasicButton
                  label="Change Password"
                  extendStyle="mt-3 bg-primary text-brand-white hover:bg-primary-dark"
                  onClick={() => setChangingPassword(true)}
                />
              )}
            </>
          </TabContent>

          {permissionError && (
            <div className="mt-3 w-full pt-3 text-center text-sm text-error">
              {permissionError}
            </div>
          )}

          <BackSubmitButtons
            loading={loading}
            setLoading={setLoading}
            validationErrors={serverValidationErrors || clientValidationErrors}
          />
        </Form>
      </WindowContainer>
    </DarkOverlay>
  );
};

export default StaffUpsert;
