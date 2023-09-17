import { type LoaderArgs, type ActionArgs } from "@remix-run/server-runtime";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { getUserObject } from "~/session.server";
import { getUserDetails, updateUserDetails } from "~/models/auth/userDetails";
import { useEffect, useState } from "react";

export const loader = async ({ request }: LoaderArgs) => {
  const { id, email } = ((await getUserObject(request)) as User) || {};
  const userDetails = await getUserDetails(id);
  return { userDetails, email };
};

export const action = async ({ request }: ActionArgs) => {
  const { id } = ((await getUserObject(request)) as User) || {};
  const { firstName, lastName, dateofbirth, phonenumber } = Object.fromEntries(
    await request.formData()
  );

  const updateData = {
    id,
    firstName: firstName as string,
    lastName: lastName as string,
    dateOfBirth: new Date(dateofbirth as string),
    phoneNumber: phonenumber as string,
  };
  await updateUserDetails(updateData);

  return { success: true };
};

const Account = () => {
  const { userDetails, email } = useLoaderData();
  const { success } = useActionData() || {};
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (success) {
      setLoading(false);
    }
  }, [success]);

  return (
    <Form method="POST" id="AccountPanel">
      <h2 className="pb-3 pl-1 text-xl font-bold max-md:pl-3">Profile</h2>
      <div className="flex h-max w-[520px] max-w-[100vw] flex-col items-center gap-3 bg-base-200 p-3">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">First Name</span>
          </label>
          <input
            name="firstName"
            type="text"
            placeholder="First Name"
            className="input input-bordered w-full"
            defaultValue={userDetails?.firstName || undefined}
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Last Name</span>
          </label>
          <input
            name="lastName"
            type="text"
            placeholder="Last Name"
            className="input input-bordered w-full"
            defaultValue={userDetails?.lastName || undefined}
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Phone Number</span>
          </label>
          <input
            name="phoneNumber"
            type="text"
            placeholder="Phone Number"
            className="input input-bordered w-full"
            defaultValue={userDetails?.phoneNumber || undefined}
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            disabled
            name="emailAddress"
            type="text"
            placeholder="Email"
            className="input input-bordered w-full !border-brand-black/10 !bg-brand-white/50"
            defaultValue={email || undefined}
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Date of Birth</span>
          </label>
          <input
            name="dateofbirth"
            type="date"
            placeholder="Date of Birth"
            className="cursor-pointer] input input-bordered w-full"
            defaultValue={
              userDetails?.dateOfBirth
                ? new Date(userDetails?.dateOfBirth).toISOString().split("T")[0]
                : undefined
            }
          />
        </div>

        <div className="flex w-full items-center justify-center pt-3 text-xs sm:w-[215px]">
          Birthday Coupons sent annually.
        </div>

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

export default Account;
