import { type FormEvent, useEffect, useState } from "react";
import { getFormData } from "~/helpers/formHelpers";
import DarkOverlay from "~/components/Layout/Overlays/DarkOverlay";
import BasicInput from "~/components/Forms/Input/BasicInput";
import PhoneInput from "~/components/Forms/Input/PhoneInput";
import { formatDateForFormField } from "~/helpers/dateHelpers";
import type { ActionReturnTypes } from "~/utility/actionTypes";
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
import type { userUpsertLoader } from "./index.server";
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
};

type Props = {
  offRouteModule?: boolean;
};

const UserUpsert = ({ offRouteModule }: Props) => {
  const { user } = useLoaderData<typeof userUpsertLoader>();
  const { serverValidationErrors, success, notification } =
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

  const tabNames = ["general", "address"];
  const [activeTab, setActiveTab] = useState<string | undefined>(tabNames?.[0]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

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

    const submitFunction = () => {
      submit(form, {
        method: "POST",
        action: `/admin/upsert/${contentType}?contentId=${contentId}`,
        navigate: offRouteModule ? false : true,
      });
    };

    submitFunction();

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
        title="User"
        isActive={user?.isActive}
        hasMode={true}
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
            <UploadAvatar avatar={user?.avatar} />

            <BasicInput
              name="email"
              label="Email Address"
              placeholder="Email Address"
              type="text"
              extendContainerStyle="w-full"
              defaultValue={user?.email || undefined}
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
              defaultValue={user?.userDetails?.firstName || undefined}
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
              defaultValue={user?.userDetails?.lastName || undefined}
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
              defaultValue={user?.userDetails?.phoneNumber || undefined}
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
                user?.userDetails?.dateOfBirth,
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
              defaultValue={user?.address?.addressLine1 || undefined}
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
              defaultValue={user?.address?.addressLine2 || undefined}
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
              defaultValue={user?.address?.suburb || undefined}
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
              defaultValue={user?.address?.postcode || undefined}
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
              defaultValue={user?.address?.state || undefined}
              validationErrors={
                serverValidationErrors || clientValidationErrors
              }
            />

            <SelectCountry
              defaultValue={user?.address?.country}
              validationErrors={
                serverValidationErrors || clientValidationErrors
              }
              extendStyle="!w-full"
            />
          </TabContent>

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

export default UserUpsert;
