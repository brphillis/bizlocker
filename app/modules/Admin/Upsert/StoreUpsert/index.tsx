import { type FormEvent, useEffect, useState } from "react";
import { json } from "@remix-run/node";
import { getFormData } from "~/helpers/formHelpers";
import DarkOverlay from "~/components/Layout/Overlays/DarkOverlay";
import BasicInput from "~/components/Forms/Input/BasicInput";
import PhoneInput from "~/components/Forms/Input/PhoneInput";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import SelectCountry from "~/components/Forms/Select/SelectCountry";
import { type ValidationErrors, validateForm } from "~/utility/validate";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import useNotification, {
  type PageNotification,
} from "~/hooks/PageNotification";
import {
  getStore,
  type NewStore,
  type StoreWithDetails,
  upsertStore,
} from "~/models/stores.server";
import {
  Form,
  type Params,
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

const validateOptions = {
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

export const storeUpsertLoader = async (
  request: Request,
  params: Params<string>
) => {
  let { searchParams } = new URL(request.url);
  let id = searchParams.get("contentId");

  if (!id) {
    throw new Response(null, {
      status: 404,
      statusText: "Store Not Found",
    });
  }

  const store = id === "add" ? ({} as StoreWithDetails) : await getStore(id);

  if (!store) {
    throw new Response(null, {
      status: 404,
      statusText: "Store Not Found",
    });
  }

  return json({ store });
};

export const storeUpsertAction = async (
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
  } = formEntries;

  if (formErrors) {
    return { serverValidationErrors: formErrors };
  }

  const updateData: NewStore = {
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

  notification = {
    type: "success",
    message: `Store ${id === "add" ? "Added" : "Updated"}.`,
  };

  return json({ success: true, notification });
};

type Props = {
  offRouteModule?: boolean;
};

const StoreUpsert = ({ offRouteModule }: Props) => {
  const { store } = useLoaderData<typeof storeUpsertLoader>();
  const { serverValidationErrors, success, notification } =
    (useActionData() as ActionReturnTypes) || {};

  const navigate = useNavigate();
  let submit = useSubmit();
  const [searchParams] = useSearchParams();
  const contentId = searchParams.get("contentId");
  const { contentType } = useParams();
  useNotification(notification);

  const [clientValidationErrors, setClientValidationErrors] =
    useState<ValidationErrors>();
  const [loading, setLoading] = useState<boolean>(false);

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
        isActive={store?.isActive}
        hasMode={true}
        title="Store"
        children={
          <Form
            method="POST"
            onSubmit={handleSubmit}
            className="scrollbar-hide relative w-[500px] max-w-full overflow-y-auto"
          >
            <div className="form-control gap-3">
              <BasicInput
                name="name"
                label="Name"
                placeholder="Name"
                type="text"
                customWidth="w-full"
                defaultValue={store?.name || undefined}
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
                defaultValue={store?.phoneNumber || undefined}
                validationErrors={
                  serverValidationErrors || clientValidationErrors
                }
              />

              <BasicInput
                name="faxNumber"
                label="Fax Number"
                placeholder="Fax Number"
                type="number"
                customWidth="w-full"
                defaultValue={store?.faxNumber || undefined}
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
                defaultValue={store?.address?.addressLine1 || undefined}
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
                defaultValue={store?.address?.addressLine2 || undefined}
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
                defaultValue={store?.address?.suburb || undefined}
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
                defaultValue={store?.address?.postcode || undefined}
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
                defaultValue={store?.address?.state || undefined}
                validationErrors={
                  serverValidationErrors || clientValidationErrors
                }
              />

              <SelectCountry
                defaultValue={store?.address?.country}
                validationErrors={
                  serverValidationErrors || clientValidationErrors
                }
                extendStyle="!w-full"
              />

              <BasicInput
                name="longitude"
                label="Longitude"
                placeholder="Longitude"
                type="text"
                customWidth="w-full"
                defaultValue={store?.address?.longitude || undefined}
                validationErrors={
                  serverValidationErrors || clientValidationErrors
                }
              />

              <BasicInput
                name="latitude"
                label="Latitude"
                placeholder="Latitude"
                type="text"
                customWidth="w-full"
                defaultValue={store?.address?.latitude || undefined}
                validationErrors={
                  serverValidationErrors || clientValidationErrors
                }
              />

              <BasicInput
                name="paymentProviderId"
                label="Payment Provider Id"
                placeholder="Payment Provider Id"
                type="text"
                customWidth="w-full"
                defaultValue={store?.paymentProviderId || undefined}
                validationErrors={
                  serverValidationErrors || clientValidationErrors
                }
              />
            </div>
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

export default StoreUpsert;
