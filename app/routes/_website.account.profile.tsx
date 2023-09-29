import { useEffect, useState } from "react";
import { isValidMobileNumber } from "~/utility/validate";
import { getUserDataFromSession } from "~/session.server";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { type ActionArgs, type LoaderArgs } from "@remix-run/server-runtime";
import { getUserDetails, upsertUserDetails } from "~/models/auth/userDetails";

export const loader = async ({ request }: LoaderArgs) => {
  const { id, email } = ((await getUserDataFromSession(request)) as User) || {};
  const userDetails = await getUserDetails(id);
  return { userDetails, email };
};

export const action = async ({ request }: ActionArgs) => {
  const { id } = ((await getUserDataFromSession(request)) as User) || {};
  const { firstName, lastName, dateofbirth, phoneNumber } = Object.fromEntries(
    await request.formData()
  );

  let validationError: string[] = [];

  if (!firstName) {
    validationError.push("First Name is Required");
  }

  if (!lastName) {
    validationError.push("Last Name is Required");
  }

  if (!phoneNumber) {
    validationError.push("Phone Number is Required");
  }
  if (phoneNumber && !isValidMobileNumber(phoneNumber as string)) {
    validationError.push("Phone Number is Invalid (+614)");
  }

  if (!dateofbirth) {
    validationError.push("Date of Birth is Required");
  }

  if (validationError.length > 0) {
    return { validationError };
  }

  const updateData = {
    id,
    firstName: firstName as string,
    lastName: lastName as string,
    dateOfBirth: new Date(dateofbirth as string),
    phoneNumber: phoneNumber as string,
  };
  await upsertUserDetails(updateData);

  return { success: "Profile Updated" };
};

const Account = () => {
  const { userDetails, email } = useLoaderData();
  const { success, validationError } =
    (useActionData() as { success: string; validationError: string[] }) || {};

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (success) {
      setLoading(false);
    }
  }, [success]);

  useEffect(() => {
    if (validationError) {
      setLoading(false);
    }
  }, [validationError]);

  return (
    <Form method="POST" id="AccountPanel">
      <h2 className="pb-3 pl-1 text-xl font-bold max-md:pb-6 max-md:pl-3">
        Profile
      </h2>
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
          Birthday Coupons sent Annually.
        </div>

        <div className="divider m-0 w-full p-0 pt-3" />

        {validationError?.length > 0 && (
          <div>
            {validationError.map((error: string, i) => {
              return (
                <p
                  key={error + i}
                  className="my-2 text-center text-xs text-red-500"
                >
                  {error}
                </p>
              );
            })}
          </div>
        )}

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

export default Account;
