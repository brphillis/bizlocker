import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import BasicInput from "~/components/Forms/Input/BasicInput";
import SelectCountry from "~/components/Forms/Select/SelectCountry";
import UploadAvatar from "~/components/Forms/Upload/UploadAvatar";
import DarkOverlay from "~/components/Layout/DarkOverlay";
import { getUser, upsertUser } from "~/models/auth/users.server";
import { validateForm } from "~/utility/validate";

export const loader = async ({ params }: LoaderArgs) => {
  const id = params?.id;

  if (id && id !== "add") {
    const user = await getUser(id);
    return user;
  } else return null;
};

export const action = async ({ request, params }: ActionArgs) => {
  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());
  const {
    email,
    firstName,
    lastName,
    dateofbirth,
    phoneNumber,
    address1,
    address2,
    postcode,
    suburb,
    state,
    country,
    avatar,
    isActive,
  } = form;

  const validate = {
    email: true,
    firstName: true,
    lastName: true,
    dateofbirth: true,
    phoneNumber: true,
    address1: true,
    postcode: true,
    suburb: true,
    state: true,
    country: true,
  };

  const validationErrors = validateForm(form, validate);
  if (validationErrors) {
    return { validationErrors };
  }

  const updateData = {
    email: email as string,
    firstName: firstName as string,
    lastName: lastName as string,
    dateOfBirth: new Date(dateofbirth as string),
    phoneNumber: phoneNumber as string,
    addressLine1: address1 as string,
    addressLine2: address2 as string,
    postcode: postcode as string,
    suburb: suburb as string,
    state: state as string,
    country: country as string,
    isActive: isActive ? true : false,
    avatar: avatar ? (JSON.parse(avatar?.toString()) as Image) : undefined,
    id: id,
  };

  await upsertUser(updateData);

  return { success: true };
};

const ModifyUser = () => {
  const navigate = useNavigate();
  const user = useLoaderData();
  const { validationErrors, success } =
    (useActionData() as {
      success: boolean;
      validationErrors: ValidationErrors;
    }) || {};

  const mode = user ? "edit" : "add";

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
        className="relative w-[600px] bg-base-200 py-6 sm:px-6"
      >
        <FormHeader
          hasDelete={false}
          hasIsActive={true}
          mode={mode}
          type="User"
          valueToChange={user}
        />

        <div className="form-control gap-3">
          <div className="flex flex-wrap justify-evenly gap-3">
            <UploadAvatar avatar={user?.avatar} />

            <div className="flex flex-row flex-wrap justify-center gap-6">
              <div className="form-control gap-3">
                <BasicInput
                  name="email"
                  label="Email Address"
                  placeholder="Email Address"
                  type="text"
                  defaultValue={user?.email || undefined}
                  validationErrors={validationErrors}
                />

                <BasicInput
                  name="firstName"
                  label="First Name"
                  placeholder="First Name"
                  type="text"
                  defaultValue={user?.userDetails?.firstName || undefined}
                  validationErrors={validationErrors}
                />

                <BasicInput
                  name="lastName"
                  label="Last Name"
                  placeholder="Last Name"
                  type="text"
                  defaultValue={user?.userDetails?.lastName || undefined}
                  validationErrors={validationErrors}
                />

                <BasicInput
                  name="phoneNumber"
                  label="Phone Number"
                  placeholder="Phone Number"
                  type="text"
                  defaultValue={user?.userDetails?.phoneNumber || undefined}
                  validationErrors={validationErrors}
                />

                <BasicInput
                  name="dateofbirth"
                  label="Date of Birth"
                  placeholder="Date of Birth"
                  type="date"
                  defaultValue={
                    user?.userDetails?.dateOfBirth
                      ? new Date(user?.userDetails?.dateOfBirth)
                          .toISOString()
                          .split("T")[0]
                      : undefined
                  }
                  validationErrors={validationErrors}
                />
              </div>

              <div className="form-control gap-3">
                <BasicInput
                  name="address1"
                  label="Address Line 1"
                  placeholder="Address Line 1"
                  type="text"
                  defaultValue={user?.address?.addressLine1 || undefined}
                  validationErrors={validationErrors}
                />

                <BasicInput
                  name="address2"
                  label="Address Line 2"
                  placeholder="Address Line 2"
                  type="text"
                  defaultValue={user?.address?.addressLine2 || undefined}
                  validationErrors={validationErrors}
                />

                <BasicInput
                  name="suburb"
                  label="Suburb"
                  placeholder="Suburb"
                  type="text"
                  defaultValue={user?.address?.suburb || undefined}
                  validationErrors={validationErrors}
                />

                <BasicInput
                  name="postcode"
                  label="PostCode"
                  placeholder="PostCode"
                  type="text"
                  defaultValue={user?.address?.postcode || undefined}
                  validationErrors={validationErrors}
                />

                <BasicInput
                  name="state"
                  label="State"
                  placeholder="State"
                  type="text"
                  defaultValue={user?.address?.state || undefined}
                  validationErrors={validationErrors}
                />

                <SelectCountry
                  defaultValue={user?.address?.country}
                  validationErrors={validationErrors}
                />
              </div>
            </div>
          </div>
        </div>
        <BackSubmitButtons loading={loading} setLoading={setLoading} />
      </Form>
    </DarkOverlay>
  );
};

export default ModifyUser;
