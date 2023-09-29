import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { Link, useActionData } from "@remix-run/react";
import { googleLogin, verifyLogin } from "~/models/auth/login.server";
import { createUserSession } from "~/session.server";
import LoginGoogle from "~/components/auth/LoginGoogle";
import { isValidEmail, isValidPassword } from "~/utility/validate";
import AuthPageWrapper from "~/components/Layout/AuthPageWrapper";
import AuthContainer from "~/components/Layout/AuthContainer";

export const action = async ({ request }: ActionArgs) => {
  const form = Object.fromEntries(await request.formData());

  switch (form._action) {
    case "login":
      const { email, password, remember } = form;
      let validationError: string[] = [];

      if (!isValidEmail(email as string)) {
        validationError.push("Invalid Email Address");
      }

      if (!isValidPassword(password as string)) {
        validationError.push("Password Does Not Meet Requirements");
      }

      if (validationError.length > 0) {
        return { validationError };
      }

      const { user, error } = await verifyLogin(
        email as string,
        password as string
      );

      if (error) {
        const validationError = [error];
        return { validationError };
      }

      if (user) {
        return createUserSession({
          request,
          user: JSON.stringify(user),
          remember: remember === "on" ? true : false,
          redirectTo: "/",
        });
      } else {
        const validationError = ["Incorrect Credentials"];
        return { validationError };
      }

    case "googleLogin":
      const { credential } = form;
      if (credential) {
        return await googleLogin(request, credential);
      }
  }
};

export const meta: V2_MetaFunction = () => [{ title: "Login" }];

export default function LoginPage() {
  const { validationError } =
    (useActionData() as { validationError: string[] }) || {};

  return (
    <AuthPageWrapper>
      <AuthContainer>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-brand-white">Email</span>
          </label>
          <input
            name="email"
            type="text"
            placeholder="email"
            className="input input-bordered bg-base-100 text-brand-black/50 focus:text-brand-black"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-brand-white">Password</span>
          </label>
          <input
            name="password"
            type="password"
            placeholder="password"
            className="input input-bordered bg-base-100 text-brand-black/50 focus:text-brand-black"
          />

          <Link
            to="/forgot-password"
            className="link-hover link mb-3 ml-1 mt-2 cursor-pointer text-xs text-brand-white/75"
          >
            Forgot password?
          </Link>
        </div>

        <>
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

          {validationError?.[0]?.includes("Email not Verified") && (
            <Link
              to="/request-verification-code"
              className="link-hover link mb-2 cursor-pointer text-center text-xs text-brand-white/75"
            >
              Resend Email?
            </Link>
          )}
        </>

        <div className="form-control mt-3 gap-3">
          <button
            type="submit"
            name="_action"
            value="login"
            className="btn btn-primary !rounded-sm"
          >
            Login
          </button>
          <Link
            to="/register"
            type="button"
            className="btn btn-primary !rounded-sm"
          >
            Create Account
          </Link>
          <div className="my-2 w-full border-b-2 border-brand-white/10" />
          <LoginGoogle />
        </div>
      </AuthContainer>
    </AuthPageWrapper>
  );
}
