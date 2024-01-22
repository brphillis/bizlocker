import { useEffect, useState } from "react";
import BasicInput from "~/components/Forms/Input/BasicInput";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import SelectCountry from "~/components/Forms/Select/SelectCountry";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { accountAddressLoader } from "~/modules/Website/Account/Address/index.server";

const AccountAddress = () => {
  const { userAddress } = useLoaderData<typeof accountAddressLoader>();
  const { success, validationErrors } =
    (useActionData() as ActionReturnTypes) || {};

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
          extendContainerStyle="w-full"
          extendStyle="input-bordered"
          type="text"
          defaultValue={userAddress?.addressLine1 || undefined}
          validationErrors={validationErrors}
        />

        <BasicInput
          name="addressLine2"
          label="Address Line 2"
          placeholder="Address Line 2"
          extendContainerStyle="w-full"
          extendStyle="input-bordered"
          type="text"
          defaultValue={userAddress?.addressLine2 || undefined}
          validationErrors={validationErrors}
        />

        <BasicInput
          name="suburb"
          label="Suburb"
          placeholder="Suburb"
          extendContainerStyle="w-full"
          extendStyle="input-bordered"
          type="text"
          defaultValue={userAddress?.suburb || undefined}
          validationErrors={validationErrors}
        />

        <BasicInput
          name="postcode"
          label="PostCode"
          placeholder="PostCode"
          extendContainerStyle="w-full"
          extendStyle="input-bordered"
          type="text"
          defaultValue={userAddress?.postcode || undefined}
          validationErrors={validationErrors}
        />

        <BasicInput
          name="state"
          label="State"
          placeholder="State"
          extendContainerStyle="w-full"
          extendStyle="input-bordered"
          type="text"
          defaultValue={userAddress?.state || undefined}
          validationErrors={validationErrors}
        />

        <SelectCountry
          defaultValue={userAddress?.country}
          validationErrors={validationErrors}
          extendStyle="!w-full"
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

export default AccountAddress;
