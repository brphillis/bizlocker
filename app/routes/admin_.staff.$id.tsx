import type { Image, Staff } from "@prisma/client";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import {
  redirect,
  type ActionArgs,
  type LoaderArgs,
  json,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { tokenAuth } from "~/auth.server";
import BasicButton from "~/components/Buttons/BasicButton";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import BasicInput from "~/components/Forms/Input/BasicInput";
import PhoneInput from "~/components/Forms/Input/PhoneInput";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import SelectCountry from "~/components/Forms/Select/SelectCountry";
import UploadAvatar from "~/components/Forms/Upload/UploadAvatar";
import DarkOverlay from "~/components/Layout/DarkOverlay";
import {
  type StaffWithDetails,
  getStaff,
  upsertStaff,
} from "~/models/auth/staff.server";
import { getAvailableRoles } from "~/models/enums.server";
import { getStores } from "~/models/stores.server";
import { STAFF_SESSION_KEY, getUserDataFromSession } from "~/session.server";
import { validateForm } from "~/utility/validate";

export const loader = async ({ request, params }: LoaderArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const { role } =
    ((await getUserDataFromSession(request, STAFF_SESSION_KEY)) as Staff) || {};

  const roles = await getAvailableRoles();
  const stores = await getStores();

  const id = params?.id;

  if (!id) {
    throw new Response(null, {
      status: 404,
      statusText: "Staff Not Found",
    });
  }

  const staffMember =
    id === "add" ? ({} as StaffWithDetails) : await getStaff(id);

  if (!staffMember) {
    throw new Response(null, {
      status: 404,
      statusText: "Staff Not Found",
    });
  }

  return json({ staffMember, roles, stores, role });
};

export const action = async ({ request, params }: ActionArgs) => {
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
    role,
    jobTitle,
    store,
    password,
    isActive,
  } = form;

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
    password: false,
    ...(password && { password: true }),
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
    isActive: isActive ? true : false,
    avatar: avatar ? (JSON.parse(avatar?.toString()) as Image) : undefined,
    role: role as string,
    jobTitle: jobTitle as string,
    store: store as string,
    id: id,
    ...(password && { password: password as string }),
  };

  let permissionError, success;

  try {
    await upsertStaff(request, updateData);
    success = true;
  } catch (err) {
    permissionError = err;
  }

  return json({ success, permissionError });
};

const ModifyStaff = () => {
  const navigate = useNavigate();
  const { staffMember, roles, stores, role } = useLoaderData<typeof loader>();
  const { validationErrors, permissionError, success } =
    (useActionData() as ActionReturnTypes) || {};

  const [loading, setLoading] = useState<boolean>(false);
  const [changingPassword, setChangingPassword] = useState<boolean>(false);

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
        className="absolute top-0 w-[600px] bg-base-200 py-6 sm:px-6"
      >
        <FormHeader
          hasDelete={false}
          hasIsActive={true}
          type="Staff"
          valueToChange={staffMember}
        />

        <div className="form-control gap-3">
          <div className="flex flex-wrap justify-evenly gap-3">
            <UploadAvatar avatar={staffMember?.avatar} />

            <div className="flex flex-row flex-wrap justify-center gap-3">
              <BasicSelect
                name="role"
                label="Role"
                customWidth="w-full"
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
                customWidth="w-full"
                defaultValue={staffMember?.jobTitle || undefined}
                validationErrors={validationErrors}
              />

              <BasicSelect
                label="Store"
                name="store"
                customWidth="w-full"
                placeholder="Select a Store"
                selections={stores}
                defaultValue={staffMember?.storeId || ""}
              />

              <BasicInput
                name="email"
                label="Email Address"
                placeholder="Email Address"
                type="text"
                customWidth="w-full"
                defaultValue={staffMember?.email || undefined}
                validationErrors={validationErrors}
              />

              <BasicInput
                name="firstName"
                label="First Name"
                placeholder="First Name"
                type="text"
                customWidth="w-full"
                defaultValue={staffMember?.userDetails?.firstName || undefined}
                validationErrors={validationErrors}
              />

              <BasicInput
                name="lastName"
                label="Last Name"
                placeholder="Last Name"
                type="text"
                customWidth="w-full"
                defaultValue={staffMember?.userDetails?.lastName || undefined}
                validationErrors={validationErrors}
              />

              <PhoneInput
                name="phoneNumber"
                label="Phone Number"
                placeholder="Phone Number"
                type="text"
                customWidth="w-full"
                defaultValue={
                  staffMember?.userDetails?.phoneNumber || undefined
                }
                validationErrors={validationErrors}
              />

              <BasicInput
                name="dateofbirth"
                label="Date of Birth"
                placeholder="Date of Birth"
                type="date"
                customWidth="w-full"
                defaultValue={
                  staffMember?.userDetails?.dateOfBirth
                    ? new Date(staffMember?.userDetails?.dateOfBirth)
                        .toISOString()
                        .split("T")[0]
                    : undefined
                }
                validationErrors={validationErrors}
              />

              <BasicInput
                name="addressLine1"
                label="Address Line 1"
                placeholder="Address Line 1"
                type="text"
                customWidth="w-full"
                defaultValue={staffMember?.address?.addressLine1 || undefined}
                validationErrors={validationErrors}
              />

              <BasicInput
                name="addressLine2"
                label="Address Line 2"
                placeholder="Address Line 2"
                type="text"
                customWidth="w-full"
                defaultValue={staffMember?.address?.addressLine2 || undefined}
                validationErrors={validationErrors}
              />

              <BasicInput
                name="suburb"
                label="Suburb"
                placeholder="Suburb"
                type="text"
                customWidth="w-full"
                defaultValue={staffMember?.address?.suburb || undefined}
                validationErrors={validationErrors}
              />

              <BasicInput
                name="postcode"
                label="PostCode"
                placeholder="PostCode"
                type="text"
                customWidth="w-full"
                defaultValue={staffMember?.address?.postcode || undefined}
                validationErrors={validationErrors}
              />

              <BasicInput
                name="state"
                label="State"
                placeholder="State"
                type="text"
                customWidth="w-full"
                defaultValue={staffMember?.address?.state || undefined}
                validationErrors={validationErrors}
              />

              <SelectCountry
                defaultValue={staffMember?.address?.country}
                validationErrors={validationErrors}
                styles="!w-full"
              />

              {changingPassword &&
                (role === "DEVELOPER" || role === "ADMIN") && (
                  <>
                    <BasicInput
                      name="password"
                      label="Password"
                      placeholder="Password"
                      type="password"
                      customWidth="w-full"
                      defaultValue={undefined}
                      validationErrors={validationErrors}
                    />

                    <BasicButton
                      label="Cancel Password Change"
                      extendStyle="mt-3"
                      clickFunction={() => setChangingPassword(false)}
                    />
                  </>
                )}

              {!changingPassword && (
                <BasicButton
                  label="Change Password"
                  extendStyle="mt-3"
                  clickFunction={() => setChangingPassword(true)}
                />
              )}
            </div>
          </div>
        </div>

        {permissionError && (
          <div className="mt-3 w-full pt-3 text-center text-sm text-error">
            {permissionError}
          </div>
        )}

        <BackSubmitButtons
          loading={loading}
          setLoading={setLoading}
          validationErrors={validationErrors}
        />
      </Form>
    </DarkOverlay>
  );
};

export default ModifyStaff;
