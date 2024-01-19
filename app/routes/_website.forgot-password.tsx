import { useEffect } from "react";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import { isValidEmail } from "~/utility/validate";
import { ActionAlert } from "~/components/Notifications/Alerts";
import { initiatePasswordReset } from "~/models/auth/verification.server";
import { Form, NavLink, useActionData, useNavigate } from "@remix-run/react";
import {
  json,
  type ActionFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";

import background from "../assets/banners/banner-login.jpg";

export const meta: MetaFunction = ({ data }) => {
  return [
    { title: "CLUTCH | Forgot Password" },
    {
      name: "CLUTCH | Forgot Password",
      content: "CLUTCH | Forgot Password",
    },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = Object.fromEntries(await request.formData());
  const { email } = form;
  let validationError: string[] = [];

  if (!isValidEmail(email as string)) {
    validationError.push("Invalid Email Address");
  }

  if (validationError.length > 0) {
    return json({ validationError });
  }

  try {
    const { success } = await initiatePasswordReset(email as string);

    return json({ success });
  } catch (error: any) {
    const validationError = [error.message] as string[];

    return json({ validationError });
  }
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { validationErrors, success } =
    (useActionData() as ActionReturnTypes) || {};

  useEffect(() => {
    const successPopup = () => {
      ActionAlert(
        "Verification Email Sent!",
        "Check your inbox to reset your password.",
        () => navigate("/login"),
      );
    };

    if (success) {
      successPopup();
    }
  }, [success, navigate]);

  return (
    <div className="relative flex h-full min-h-[calc(100dvh-64px)] w-full items-center justify-center">
      <div
        style={{
          backgroundImage: `url(${background})`,
        }}
        className="absolute top-0 z-0 h-full w-full bg-cover brightness-75"
      />
      <Form
        method="POST"
        className="w-max-content form-control relative w-[24rem] max-w-[98vw] rounded-lg bg-brand-black p-8 text-brand-white"
      >
        <h1 className="select-none pb-6 pt-3 text-center text-6xl font-bold tracking-wide text-white/90">
          CLUTCH
        </h1>

        <p className="py-6 text-center text-sm">
          Enter your email address to reset your password.
        </p>

        <div className="form-control">
          <input
            name="email"
            type="text"
            placeholder="email"
            className="input input-bordered bg-base-100 text-brand-black/50 focus:text-brand-black"
          />
        </div>

        {Object.values(validationErrors).map((error: string, i) => (
          <p key={i} className="mt-1 text-center text-xs text-red-500/75">
            {error}
          </p>
        ))}

        <div className="form-control mt-12">
          <button type="submit" className="btn btn-primary mb-3">
            Submit
          </button>
          <NavLink to="/login" type="button" className="btn btn-primary">
            Back
          </NavLink>
        </div>
      </Form>
    </div>
  );
}
