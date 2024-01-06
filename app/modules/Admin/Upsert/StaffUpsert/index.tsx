import { type FormEvent, useEffect, useState } from "react";
import { json } from "@remix-run/node";
import { getStores } from "~/models/stores.server";
import type { Image, Staff } from "@prisma/client";
import { getFormData } from "~/helpers/formHelpers";
import DarkOverlay from "~/components/Layout/Overlays/DarkOverlay";
import { getAvailableRoles } from "~/models/enums.server";
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
import { getUserDataFromSession, STAFF_SESSION_KEY } from "~/session.server";
import useNotification, {
  type PageNotification,
} from "~/hooks/PageNotification";
import {
  getStaff,
  type StaffWithDetails,
  upsertStaff,
} from "~/models/staff.server";
import {
  Form,
  type Params,
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
  useSearchParams,
} from "@remix-run/react";
import WindowContainer from "~/components/Layout/Containers/WindowContainer";

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

export const staffUpsertLoader = async (
  request: Request,
  params: Params<string>
) => {
  const { role } =
    ((await getUserDataFromSession(request, STAFF_SESSION_KEY)) as Staff) || {};

  const roles = await getAvailableRoles();
  const stores = await getStores();

  let { searchParams } = new URL(request.url);
  let id = searchParams.get("contentId");

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

export const staffUpsertAction = async (
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
    role,
    jobTitle,
    store,
    password,
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
    isActive: isActive ? true : false,
    avatar: avatar ? (JSON.parse(avatar?.toString()) as Image) : undefined,
    role: role as string,
    jobTitle: jobTitle as string,
    store: store as string,
    id: id as string,
    ...(password && { password: password as string }),
  };

  let permissionError, success;

  try {
    await upsertStaff(request, updateData);
    success = true;
  } catch (err) {
    permissionError = err;
  }

  notification = {
    type: "success",
    message: `User ${id === "add" ? "Added" : "Updated"}.`,
  };

  return json({ success, permissionError, notification });
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
  let submit = useSubmit();
  const [searchParams] = useSearchParams();
  const contentId = searchParams.get("contentId");
  useNotification(notification);

  const [clientValidationErrors, setClientValidationErrors] =
    useState<ValidationErrors>();
  const [loading, setLoading] = useState<boolean>(false);
  const [changingPassword, setChangingPassword] = useState<boolean>(false);

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
        action: `/admin/upsert/staff?contentId=${contentId}`,
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
        isActive={staffMember?.isActive}
        hasMode={true}
        title="Staff"
        children={
          <Form
            method="POST"
            onSubmit={handleSubmit}
            className="scrollbar-hide relative w-[600px] max-w-[100vw] overflow-y-auto bg-base-200 px-3 py-6 sm:px-6"
          >
            <div className="form-control gap-3">
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
                  validationErrors={
                    serverValidationErrors || clientValidationErrors
                  }
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
                  defaultValue={
                    staffMember?.userDetails?.firstName || undefined
                  }
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
                  customWidth="w-full"
                  defaultValue={
                    staffMember?.userDetails?.phoneNumber || undefined
                  }
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
                    staffMember?.userDetails?.dateOfBirth
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
                  customWidth="w-full"
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
                  customWidth="w-full"
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
                  customWidth="w-full"
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
                  customWidth="w-full"
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
              validationErrors={
                serverValidationErrors || clientValidationErrors
              }
            />
          </Form>
        }
      />
    </DarkOverlay>
  );
};

export default StaffUpsert;
