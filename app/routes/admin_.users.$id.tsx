import type { Image } from "@prisma/client";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { tokenAuth } from "~/auth.server";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import BasicInput from "~/components/Forms/Input/BasicInput";
import PhoneInput from "~/components/Forms/Input/PhoneInput";
import SelectCountry from "~/components/Forms/Select/SelectCountry";
import UploadAvatar from "~/components/Forms/Upload/UploadAvatar";
import DarkOverlay from "~/components/Layout/DarkOverlay";
import {
  type UserWithDetails,
  getUser,
  upsertUser,
} from "~/models/auth/users.server";
import { STAFF_SESSION_KEY } from "~/session.server";
import { validateForm } from "~/utility/validate";
import useNotification, {
  type PageNotification,
} from "~/hooks/PageNotification";
import { formatDateForFormField } from "~/helpers/dateHelpers";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const id = params?.id;

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

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());

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
  } = form;

  let notification: PageNotification;

  const validate = {
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

  const validationErrors = validateForm(form, validate);

  if (validationErrors) {
    return json({ validationErrors });
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

const ModifyUser = () => {
  const { user } = useLoaderData<typeof loader>();
  const { validationErrors, success, notification } =
    (useActionData() as ActionReturnTypes) || {};

  const navigate = useNavigate();
  useNotification(notification);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (success) {
      navigate(-1);
    }
    if (validationErrors) {
      setLoading(false);
    }
  }, [success, navigate, validationErrors]);

  return (
    <DarkOverlay>
      <Form
        method="POST"
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
              validationErrors={validationErrors}
            />

            <BasicInput
              name="firstName"
              label="First Name"
              placeholder="First Name"
              type="text"
              customWidth="w-full"
              defaultValue={user?.userDetails?.firstName || undefined}
              validationErrors={validationErrors}
            />

            <BasicInput
              name="lastName"
              label="Last Name"
              placeholder="Last Name"
              type="text"
              customWidth="w-full"
              defaultValue={user?.userDetails?.lastName || undefined}
              validationErrors={validationErrors}
            />

            <PhoneInput
              name="phoneNumber"
              label="Phone Number"
              placeholder="Phone Number"
              type="text"
              customWidth="w-full"
              defaultValue={user?.userDetails?.phoneNumber || undefined}
              validationErrors={validationErrors}
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
              validationErrors={validationErrors}
            />

            <BasicInput
              name="addressLine1"
              label="Address Line 1"
              placeholder="Address Line 1"
              type="text"
              customWidth="w-full"
              defaultValue={user?.address?.addressLine1 || undefined}
              validationErrors={validationErrors}
            />

            <BasicInput
              name="addressLine2"
              label="Address Line 2"
              placeholder="Address Line 2"
              type="text"
              customWidth="w-full"
              defaultValue={user?.address?.addressLine2 || undefined}
              validationErrors={validationErrors}
            />

            <BasicInput
              name="suburb"
              label="Suburb"
              placeholder="Suburb"
              type="text"
              customWidth="w-full"
              defaultValue={user?.address?.suburb || undefined}
              validationErrors={validationErrors}
            />

            <BasicInput
              name="postcode"
              label="PostCode"
              placeholder="PostCode"
              type="text"
              customWidth="w-full"
              defaultValue={user?.address?.postcode || undefined}
              validationErrors={validationErrors}
            />

            <BasicInput
              name="state"
              label="State"
              placeholder="State"
              type="text"
              customWidth="w-full"
              defaultValue={user?.address?.state || undefined}
              validationErrors={validationErrors}
            />

            <SelectCountry
              defaultValue={user?.address?.country}
              validationErrors={validationErrors}
              extendStyle="!w-full"
            />
          </div>
        </div>
        <BackSubmitButtons
          loading={loading}
          setLoading={setLoading}
          validationErrors={validationErrors}
        />
      </Form>
    </DarkOverlay>
  );
};

export default ModifyUser;
