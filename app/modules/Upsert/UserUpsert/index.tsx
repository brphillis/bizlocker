import { type FormEvent, useEffect, useState } from "react";
import { json } from "@remix-run/node";
import type { Image } from "@prisma/client";
import { getFormData } from "~/helpers/formHelpers";
import DarkOverlay from "~/components/Layout/DarkOverlay";
import BasicInput from "~/components/Forms/Input/BasicInput";
import PhoneInput from "~/components/Forms/Input/PhoneInput";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import { formatDateForFormField } from "~/helpers/dateHelpers";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import UploadAvatar from "~/components/Forms/Upload/UploadAvatar";
import SelectCountry from "~/components/Forms/Select/SelectCountry";
import { type ValidationErrors, validateForm } from "~/utility/validate";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import useNotification, {
  type PageNotification,
} from "~/hooks/PageNotification";
import {
  getUser,
  type UserWithDetails,
  upsertUser,
} from "~/models/auth/users.server";
import {
  Form,
  type Params,
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
  useSearchParams,
} from "@remix-run/react";

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

export const userUpsertLoader = async (
  request: Request,
  params: Params<string>
) => {
  let { searchParams } = new URL(request.url);
  let id = searchParams.get("contentId");

  if (!id) {
    throw new Response(null, {
      status: 404,
      statusText: "User Not Found",
    });
  }

  const user = id === "add" ? ({} as UserWithDetails) : await getUser(id);

  if (!user) {
    throw new Response(null, {
      status: 404,
      statusText: "User Not Found",
    });
  }

  return json({ user });
};

export const userUpsertAction = async (
  request: Request,
  params: Params<string>
) => {
  let notification: PageNotification;

  let { searchParams } = new URL(request.url);
  const contentId = searchParams.get("contentId");
  let id = contentId === "add" || !contentId ? undefined : contentId;

  const { formEntries, formErrors } = validateForm(
    await request.formData(),
    validateOptions
  );

  const {
    email,
    firstName,
    lastName,
    dateofbirth,
    phoneNumber,
    addressLine1,
    addressLine2,
    postcode,
    suburb,
    state,
    country,
    avatar,
    isActive,
  } = formEntries;

  if (formErrors) {
    return { serverValidationErrors: formErrors };
  }

  const updateData = {
    email: email as string,
    firstName: firstName as string,
    lastName: lastName as string,
    dateOfBirth: new Date(dateofbirth as string),
    phoneNumber: phoneNumber as string,
    addressLine1: addressLine1 as string,
    addressLine2: addressLine2 as string,
    postcode: postcode as string,
    suburb: suburb as string,
    state: state as string,
    country: country as string,
    isActive: id ? (isActive ? true : false) : false,
    avatar: avatar ? (JSON.parse(avatar?.toString()) as Image) : undefined,
    id: id,
  };

  await upsertUser(updateData);

  notification = {
    type: "success",
    message: `User ${id === "add" ? "Added" : "Updated"}.`,
  };

  return json({ success: true, notification });
};

type Props = {
  asModule?: boolean;
};

const ModifyUser = ({ asModule }: Props) => {
  const { user } = useLoaderData<typeof userUpsertLoader>();
  const { serverValidationErrors, success, notification } =
    (useActionData() as ActionReturnTypes) || {};

  const navigate = useNavigate();
  let submit = useSubmit();
  const [searchParams] = useSearchParams();
  const contentId = searchParams.get("contentId");
  useNotification(notification);

  const [clientValidationErrors, setClientValidationErrors] =
    useState<ValidationErrors>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const form = getFormData(event);
    event.preventDefault();

    const { formErrors } = validateForm(new FormData(form), validateOptions);
    if (formErrors) {
      setClientValidationErrors(formErrors);
      setLoading(false);
      return;
    }

    const submitFunction = () => {
      submit(form, {
        method: "POST",
        action: `/admin/upsert/user?contentId=${contentId}`,
        navigate: asModule ? false : true,
      });
    };

    submitFunction();

    if (asModule) {
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
      <Form
        method="POST"
        onSubmit={handleSubmit}
        className="scrollbar-hide relative w-[600px] max-w-[100vw] overflow-y-auto bg-base-200 px-3 py-6 sm:px-6"
      >
        <FormHeader
          hasDelete={false}
          hasIsActive={true}
          type="User"
          valueToChange={user}
        />

        <div className="form-control gap-3">
          <UploadAvatar avatar={user?.avatar} />

          <div className="flex flex-row flex-wrap justify-center gap-3">
            <BasicInput
              name="email"
              label="Email Address"
              placeholder="Email Address"
              type="text"
              customWidth="w-full"
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
              customWidth="w-full"
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
              customWidth="w-full"
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
              customWidth="w-full"
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
              customWidth="w-full"
              defaultValue={formatDateForFormField(
                user?.userDetails?.dateOfBirth
              )}
              validationErrors={
                serverValidationErrors || clientValidationErrors
              }
            />

            <BasicInput
              name="addressLine1"
              label="Address Line 1"
              placeholder="Address Line 1"
              type="text"
              customWidth="w-full"
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
              customWidth="w-full"
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
              customWidth="w-full"
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
              customWidth="w-full"
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
              customWidth="w-full"
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
          </div>
        </div>
        <BackSubmitButtons
          loading={loading}
          setLoading={setLoading}
          validationErrors={serverValidationErrors || clientValidationErrors}
        />
      </Form>
    </DarkOverlay>
  );
};

export default ModifyUser;
