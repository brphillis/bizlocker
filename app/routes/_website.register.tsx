import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { Form, NavLink, useActionData } from "@remix-run/react";
import background from "../assets/images/banner-login.jpg";
import { registerUser } from "~/models/register.server";
import { isValidEmail, isValidPassword } from "~/utility/validate";

export const action = async ({ request }: ActionArgs) => {
  const form = Object.fromEntries(await request.formData());
  const { email, password, confirmPassword } = form;
  let validationError: string[] = [];

  if (password !== confirmPassword) {
    validationError.push("Passwords Do Not Match");
  }

  if (!isValidEmail(email as string)) {
    validationError.push("Invalid Email Address");
  }

  if (!isValidPassword(password as string)) {
    validationError.push("Password Does Not Meet Requirements");
  }

  if (validationError.length > 0) {
    return { validationError };
  }

  try {
    return await registerUser(email as string, password as string);
  } catch (error: any) {
    const validationError = error.message;
    return { validationError };
  }
};

export const meta: V2_MetaFunction = () => [{ title: "Register" }];

export const RegisterPage = () => {
  const { validationError } =
    (useActionData() as { validationError: string[] }) || {};

  return (
    <div className="relative flex h-full min-h-[calc(100vh-64px)] w-full items-center justify-center">
      <div
        style={{
          backgroundImage: `url(${background})`,
        }}
        className="absolute top-0 z-0 h-full w-full bg-cover brightness-75"
      />
      <Form
        method="POST"
        className="w-max-content form-control relative w-[24rem] max-w-[98vw] gap-3 rounded-lg bg-base-300 p-8"
      >
        <h1 className="select-none pb-6 pt-3 text-center text-6xl font-bold tracking-wide text-white/90">
          CLUTCH.
        </h1>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            name="email"
            type="text"
            placeholder="email"
            className="input-bordered input"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            name="password"
            type="password"
            placeholder="password"
            className="input-bordered input"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Confirm Password</span>
          </label>
          <input
            name="confirmPassword"
            type="password"
            placeholder="confirm password"
            className="input-bordered input"
          />
        </div>

        {validationError?.length > 0 &&
          validationError.map((error: string, index) => {
            return (
              <p
                key={error + index}
                className="mt-1 text-center text-xs text-red-500/75"
              >
                {error}
              </p>
            );
          })}

        {validationError?.includes("Password" && "Requirements") && (
          <div className="flex flex-col items-start text-[10px] text-red-500/75">
            <div>- At least one uppercase letter (A-Z) </div>
            <div>- At least one lowercase letter (a-z) </div>
            <div>
              - At least one digit (0-9) - At least one special character
              (!@#$%^&*)
            </div>
            <div>- At least 8 characters long, but no more than 32</div>
          </div>
        )}
        <div className="form-control mt-3">
          <p className="pb-6 text-[10px] opacity-75">
            By subscribing and / or creating an account you agree to CLUTCH
            Terms and Conditions, and Privacy Policy.
          </p>
          <button type="submit" className="btn-primary btn mb-3">
            Register
          </button>
          <NavLink to="/login" type="button" className="btn-primary btn">
            Back
          </NavLink>
        </div>
      </Form>
    </div>
  );
};

export default RegisterPage;
