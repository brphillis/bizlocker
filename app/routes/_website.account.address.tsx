import { type LoaderArgs, type ActionArgs } from "@remix-run/server-runtime";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { getUserObject } from "~/session.server";
import { useEffect, useState } from "react";
import { getUserAddress, updateUserAddress } from "~/models/auth/userAddress";
import SelectCountry from "~/components/Forms/Select/SelectCountry";

export const loader = async ({ request }: LoaderArgs) => {
  const { id } = ((await getUserObject(request)) as User) || {};
  const userAddress = await getUserAddress(id);
  return { userAddress };
};

export const action = async ({ request }: ActionArgs) => {
  const { id } = ((await getUserObject(request)) as User) || {};
  const { addressLine1, addressLine2, suburb, postcode, state, country } =
    Object.fromEntries(await request.formData());

  const updateData = {
    id,
    addressLine1: addressLine1 as string,
    addressLine2: addressLine2 as string,
    suburb: suburb as string,
    postcode: postcode as string,
    state: state as string,
    country: country as string,
  };
  await updateUserAddress(updateData);

  return { success: true };
};

const Address = () => {
  const { userAddress } = useLoaderData();
  const { success } = useActionData() || {};
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (success) {
      setLoading(false);
    }
  }, [success]);

  return (
    <Form method="POST" id="AddressPanel">
      <h2 className="pb-3 pl-1 text-xl font-bold max-md:pl-3">Address</h2>
      <div className="flex h-max w-[520px] max-w-[100vw] flex-col items-center gap-3 bg-base-200 p-3">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Address Line 1</span>
          </label>
          <input
            name="addressLine1"
            type="text"
            placeholder="Address Line 1"
            className="input input-bordered w-full"
            defaultValue={userAddress?.addressLine1 || undefined}
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Address Line 2</span>
          </label>
          <input
            name="addressLine2"
            type="text"
            placeholder="Address Line 2"
            className="input input-bordered w-full"
            defaultValue={userAddress?.addressLine2 || undefined}
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Suburb</span>
          </label>
          <input
            name="suburb"
            type="text"
            placeholder="Suburb"
            className="input input-bordered w-full"
            defaultValue={userAddress?.suburb || undefined}
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">PostCode</span>
          </label>
          <input
            name="postcode"
            type="text"
            placeholder="PostCode"
            className="input input-bordered w-full"
            defaultValue={userAddress?.postcode || undefined}
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">State</span>
          </label>
          <input
            name="state"
            type="text"
            placeholder="State"
            className="input input-bordered w-full"
            defaultValue={userAddress?.state || undefined}
          />
        </div>

        <SelectCountry defaultValue={userAddress?.country} styles="!w-full" />

        <div className="divider m-0 w-full p-0 pt-3" />
        <div className="flex flex-row items-center justify-center gap-3 py-3">
          <button
            type="submit"
            className="btn btn-primary w-max"
            onClick={() => setLoading && setLoading(true)}
          >
            {loading ? "Loading..." : "Update"}
          </button>
        </div>
      </div>
    </Form>
  );
};

export default Address;
