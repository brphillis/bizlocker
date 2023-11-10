import { redirect, type ActionArgs, type LoaderArgs } from "@remix-run/node";
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
import DarkOverlay from "~/components/Layout/DarkOverlay";
import { getStore, upsertStore } from "~/models/stores.server";
import { STAFF_SESSION_KEY } from "~/session.server";
import { validateForm } from "~/utility/validate";

export const loader = async ({ request, params }: LoaderArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);
  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const id = params?.id;

  if (id && id !== "add") {
    const store = await getStore(id);
    return store;
  } else return null;
};

export const action = async ({ request, params }: ActionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);
  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());
  const {
    name,
    dateofbirth,
    phoneNumber,
    faxNumber,
    addressLine1,
    addressLine2,
    postcode,
    suburb,
    state,
    country,
    longitude,
    latitude,
    paymentProviderId,
    isActive,
  } = form;

  const validate = {
    name: true,
    phoneNumber: true,
    addressLine1: true,
    postcode: true,
    suburb: true,
    state: true,
    country: true,
    latitude: true,
    longitude: true,
  };

  const validationErrors = validateForm(form, validate);
  if (validationErrors) {
    return { validationErrors };
  }

  const updateData = {
    name: name as string,
    dateOfBirth: new Date(dateofbirth as string),
    phoneNumber: phoneNumber as string,
    faxNumber: faxNumber as string,
    addressLine1: addressLine1 as string,
    addressLine2: addressLine2 as string,
    postcode: postcode as string,
    suburb: suburb as string,
    state: state as string,
    country: country as string,
    longitude: longitude as string,
    latitude: latitude as string,
    paymentProviderId: paymentProviderId as string,
    isActive: isActive ? true : false,
    id: id,
  };

  await upsertStore(updateData);

  return { success: true };
};

const ModifyStore = () => {
  const navigate = useNavigate();
  const store = useLoaderData();
  const { validationErrors, success } =
    (useActionData() as {
      success: boolean;
      validationErrors: ValidationErrors;
    }) || {};

  const mode = store ? "edit" : "add";

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
        className="absolute top-0 w-[600px] bg-base-200 py-6 sm:px-6"
      >
        <FormHeader
          hasDelete={false}
          hasIsActive={true}
          mode={mode}
          type="Store"
          valueToChange={store}
        />

        <div className="form-control gap-3">
          <div className="flex flex-wrap justify-evenly gap-3">
            <div className="flex flex-row flex-wrap justify-center gap-6">
              <BasicInput
                name="name"
                label="Name"
                placeholder="Name"
                type="text"
                customWidth="w-full"
                defaultValue={store?.name || undefined}
                validationErrors={validationErrors}
              />

              <PhoneInput
                name="phoneNumber"
                label="Phone Number"
                placeholder="Phone Number"
                type="text"
                customWidth="w-full"
                defaultValue={store?.phoneNumber || undefined}
                validationErrors={validationErrors}
              />

              <BasicInput
                name="faxNumber"
                label="Fax Number"
                placeholder="Fax Number"
                type="number"
                customWidth="w-full"
                defaultValue={store?.faxNumber || undefined}
                validationErrors={validationErrors}
              />

              <BasicInput
                name="addressLine1"
                label="Address Line 1"
                placeholder="Address Line 1"
                type="text"
                customWidth="w-full"
                defaultValue={store?.address?.addressLine1 || undefined}
                validationErrors={validationErrors}
              />

              <BasicInput
                name="addressLine2"
                label="Address Line 2"
                placeholder="Address Line 2"
                type="text"
                customWidth="w-full"
                defaultValue={store?.address?.addressLine2 || undefined}
                validationErrors={validationErrors}
              />

              <BasicInput
                name="suburb"
                label="Suburb"
                placeholder="Suburb"
                type="text"
                customWidth="w-full"
                defaultValue={store?.address?.suburb || undefined}
                validationErrors={validationErrors}
              />

              <BasicInput
                name="postcode"
                label="PostCode"
                placeholder="PostCode"
                type="text"
                customWidth="w-full"
                defaultValue={store?.address?.postcode || undefined}
                validationErrors={validationErrors}
              />

              <BasicInput
                name="state"
                label="State"
                placeholder="State"
                type="text"
                customWidth="w-full"
                defaultValue={store?.address?.state || undefined}
                validationErrors={validationErrors}
              />

              <SelectCountry
                defaultValue={store?.address?.country}
                validationErrors={validationErrors}
                styles="!w-full"
              />

              <BasicInput
                name="longitude"
                label="Longitude"
                placeholder="Longitude"
                type="text"
                customWidth="w-full"
                defaultValue={store?.address?.longitude || undefined}
                validationErrors={validationErrors}
              />

              <BasicInput
                name="latitude"
                label="Latitude"
                placeholder="Latitude"
                type="text"
                customWidth="w-full"
                defaultValue={store?.address?.latitude || undefined}
                validationErrors={validationErrors}
              />

              <BasicInput
                name="paymentProviderId"
                label="Payment Provider Id"
                placeholder="Payment Provider Id"
                type="text"
                customWidth="w-full"
                defaultValue={store?.paymentProviderId || undefined}
                validationErrors={validationErrors}
              />
            </div>
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

export default ModifyStore;
