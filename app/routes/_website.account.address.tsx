import type { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { tokenAuth } from "~/auth.server";
import { validateForm } from "~/utility/validate";
import { getUserDataFromSession } from "~/session.server";
import BasicInput from "~/components/Forms/Input/BasicInput";
import SelectCountry from "~/components/Forms/Select/SelectCountry";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { getUserAddress, upsertUserAddress } from "~/models/auth/userAddress";
import {
  json,
  redirect,
  type ActionArgs,
  type LoaderArgs,
} from "@remix-run/node";

export const loader = async ({ request }: LoaderArgs) => {
  const authenticated = await tokenAuth(request);

  if (!authenticated.valid) {
    return redirect("/login");
  }

  const { id } = ((await getUserDataFromSession(request)) as User) || {};
  const userAddress = await getUserAddress(id);

  return json({ userAddress });
};

export const action = async ({ request }: ActionArgs) => {
  const authenticated = await tokenAuth(request);

  if (!authenticated.valid) {
    return redirect("/login");
  }

  const { id } = ((await getUserDataFromSession(request)) as User) || {};
  const form = Object.fromEntries(await request.formData());
  const { addressLine1, addressLine2, suburb, postcode, state, country } = form;

  const validate = {
    addressLine1: true,
    suburb: true,
    postcode: true,
    state: true,
    country: true,
  };

  const validationErrors = validateForm(form, validate);
  if (validationErrors) {
    return json({ validationErrors });
  }

  const updateData = {
    id,
    addressLine1: addressLine1 as string,
    addressLine2: addressLine2 as string,
    suburb: suburb as string,
    postcode: postcode as string,
    state: state as string,
    country: country as string,
  };
  await upsertUserAddress(updateData);

  return json({ success: "Address Updated" });
};

const Address = () => {
  const { userAddress } = useLoaderData<typeof loader>();
  const { success, validationErrors } = useActionData() as ActionReturnTypes;

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (success) {
      setLoading(false);
    }
  }, [success]);

  useEffect(() => {
    if (validationErrors) {
      setLoading(false);
    }
  }, [validationErrors]);

  return (
    <Form method="POST" id="AddressPanel">
      <h2 className="pb-3 pl-1 text-xl font-bold max-md:pb-6 max-md:pl-3">
        Address
      </h2>
      <div className="flex h-max w-[520px] max-w-[100vw] flex-col items-center gap-3 bg-base-200 p-3">
        <BasicInput
          name="addressLine1"
          label="Address Line 1"
          placeholder="Address Line 1"
          customWidth="w-full"
          styles="input-bordered"
          type="text"
          defaultValue={userAddress?.addressLine1 || undefined}
          validationErrors={validationErrors}
        />

        <BasicInput
          name="addressLine2"
          label="Address Line 2"
          placeholder="Address Line 2"
          customWidth="w-full"
          styles="input-bordered"
          type="text"
          defaultValue={userAddress?.addressLine2 || undefined}
          validationErrors={validationErrors}
        />

        <BasicInput
          name="suburb"
          label="Suburb"
          placeholder="Suburb"
          customWidth="w-full"
          styles="input-bordered"
          type="text"
          defaultValue={userAddress?.suburb || undefined}
          validationErrors={validationErrors}
        />

        <BasicInput
          name="postcode"
          label="PostCode"
          placeholder="PostCode"
          customWidth="w-full"
          styles="input-bordered"
          type="text"
          defaultValue={userAddress?.postcode || undefined}
          validationErrors={validationErrors}
        />

        <BasicInput
          name="state"
          label="State"
          placeholder="State"
          customWidth="w-full"
          styles="input-bordered"
          type="text"
          defaultValue={userAddress?.state || undefined}
          validationErrors={validationErrors}
        />

        <SelectCountry
          defaultValue={userAddress?.country}
          validationErrors={validationErrors}
          styles="!w-full"
        />

        <div className="divider m-0 w-full p-0 pt-3" />

        {success && (
          <div>
            <p className="my-2 text-center text-xs font-bold text-green-500">
              {success}
            </p>
          </div>
        )}

        {!success && (
          <div className="flex flex-row items-center justify-center gap-3 py-3">
            <button
              type="submit"
              className="btn btn-primary w-max"
              onClick={() => setLoading && setLoading(true)}
            >
              {loading ? "Loading..." : "Update"}
            </button>
          </div>
        )}
      </div>
    </Form>
  );
};

export default Address;
