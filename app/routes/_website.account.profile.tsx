import type { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { tokenAuth } from "~/auth.server";
import { validateForm } from "~/utility/validate";
import { getUserDataFromSession } from "~/session.server";
import PhoneInput from "~/components/Forms/Input/PhoneInput";
import BasicInput from "~/components/Forms/Input/BasicInput";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { getUserDetails, upsertUserDetails } from "~/models/auth/userDetails";
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

  const { id, email } = ((await getUserDataFromSession(request)) as User) || {};
  const userDetails = await getUserDetails(id);
  return json({ userDetails, email });
};

export const action = async ({ request }: ActionArgs) => {
  const authenticated = await tokenAuth(request);
  if (!authenticated.valid) {
    return redirect("/login");
  }

  const { id } = ((await getUserDataFromSession(request)) as User) || {};
  const form = Object.fromEntries(await request.formData());

  const { firstName, lastName, dateofbirth, phoneNumber } = form;

  const validate = {
    firstName: true,
    lastName: true,
    dateofbirth: true,
    phoneNumber: true,
  };

  const validationErrors = validateForm(form, validate);
  if (validationErrors) {
    return json({ validationErrors });
  }

  const updateData = {
    id,
    firstName: firstName as string,
    lastName: lastName as string,
    dateOfBirth: new Date(dateofbirth as string),
    phoneNumber: phoneNumber as string,
  };
  await upsertUserDetails(updateData);

  return json({ success: "Profile Updated" });
};

const Account = () => {
  const { userDetails, email } = useLoaderData<typeof loader>();

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
    <Form method="POST" id="AccountPanel">
      <h2 className="pb-3 pl-1 text-xl font-bold max-md:pb-6 max-md:pl-3">
        Profile
      </h2>
      <div className="flex h-max w-[520px] max-w-[100vw] flex-col items-center gap-3 bg-base-200 p-3">
        <BasicInput
          name="firstName"
          label="First Name"
          placeholder="First Name"
          customWidth="w-full"
          styles="input-bordered"
          type="text"
          defaultValue={userDetails?.firstName || undefined}
          validationErrors={validationErrors}
        />

        <BasicInput
          name="lastName"
          label="Last Name"
          placeholder="Last Name"
          customWidth="w-full"
          styles="input-bordered"
          type="text"
          defaultValue={userDetails?.lastName || undefined}
          validationErrors={validationErrors}
        />

        <PhoneInput
          name="phoneNumber"
          label="Phone Number"
          placeholder="Phone Number"
          customWidth="w-full"
          styles="input-bordered"
          type="text"
          defaultValue={userDetails?.phoneNumber || undefined}
          validationErrors={validationErrors}
        />

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

        <BasicInput
          name="dateofbirth"
          label="Date of Birth"
          placeholder="Date of Birth"
          customWidth="w-full"
          styles="input-bordered"
          type="date"
          defaultValue={
            userDetails?.dateOfBirth
              ? new Date(userDetails?.dateOfBirth).toISOString().split("T")[0]
              : undefined
          }
          validationErrors={validationErrors}
        />

        <div className="flex w-full items-center justify-center pt-3 text-xs sm:w-[215px]">
          Birthday Coupons sent Annually.
        </div>

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

export default Account;
