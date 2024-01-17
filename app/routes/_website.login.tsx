import { createUserSession } from "~/session.server";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import { Link, useActionData, useNavigate } from "@remix-run/react";
import LoginGoogle from "~/components/Auth/LoginGoogle";
import AuthContainer from "~/components/Layout/Containers/AuthContainer";
import AuthPageWrapper from "~/components/Layout/Wrappers/AuthPageWrapper";
import { isValidEmail, isValidPassword } from "~/utility/validate";
import { googleLogin, verifyLogin } from "~/models/auth/login.server";
import {
  json,
  type ActionFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import BasicButton from "~/components/Buttons/BasicButton";
import BasicInput from "~/components/Forms/Input/BasicInput";
import ValidationErrorsList from "~/components/Forms/Validation/ValidationErrorsList";

export const meta: MetaFunction = ({ data }) => {
  return [
    { title: "CLUTCH | Login" },
    {
      name: "CLUTCH | Login",
      content: "CLUTCH | Login",
    },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = Object.fromEntries(await request.formData());

  switch (form._action) {
    case "login":
      const { email, password, remember } = form;
      let validationErrors: string[] = [];

      if (!isValidEmail(email as string)) {
        validationErrors.push("Invalid Email Address");
      }

      if (!isValidPassword(password as string)) {
        validationErrors.push("Password Does Not Meet Requirements");
      }

      if (validationErrors.length > 0) {
        return json({ validationErrors });
      }

      const { user, error } = await verifyLogin(
        email as string,
        password as string,
      );

      if (error) {
        const validationErrors = [error];
        return json({ validationErrors });
      }

      if (user) {
        return await createUserSession({
          request,
          user: JSON.stringify(user),
          remember: remember === "on" ? true : false,
          redirectTo: "/",
        });
      } else {
        const validationErrors = ["Incorrect Credentials"];
        return json({ validationErrors });
      }

    case "googleLogin":
      const { credential } = form;
      if (credential) {
        return await googleLogin(request, credential);
      }
  }
};

export default function LoginPage() {
  const { validationErrors } = (useActionData() as ActionReturnTypes) || {};

  const navigate = useNavigate();

  return (
    <AuthPageWrapper>
      <AuthContainer>
        <BasicInput
          name="email"
          type="text"
          label="Email"
          customWidth="w-full"
          extendStyle="input input-bordered bg-base-100 text-brand-black/50 focus:text-brand-black"
          labelStyle="text-brand-white"
          placeholder="Email"
        />

        <BasicInput
          name="password"
          type="password"
          label="Password"
          customWidth="w-full"
          extendStyle="input input-bordered bg-base-100 text-brand-black/50 focus:text-brand-black"
          labelStyle="text-brand-white"
          placeholder="Password"
        />

        <Link
          to="/forgot-password"
          className="link-hover link mb-3 ml-1 mt-2 cursor-pointer text-xs text-brand-white/75"
        >
          Forgot password?
        </Link>

        <>
          <ValidationErrorsList validationErrors={validationErrors} />

          {validationErrors &&
            Object.values(validationErrors)?.includes("Email not Verified") && (
              <Link
                to="/request-verification-code"
                className="link-hover link mb-2 cursor-pointer text-center text-xs text-brand-white/75"
              >
                Resend Email?
              </Link>
            )}
        </>

        <div className="form-control mt-3 gap-3">
          <BasicButton
            type="submit"
            name="_action"
            value="login"
            label="Login"
          />

          <BasicButton
            label="Create Account"
            onClick={() => navigate("/register")}
          />

          <div className="my-2 w-full border-b-2 border-brand-white/10" />
          <LoginGoogle />
        </div>
      </AuthContainer>
    </AuthPageWrapper>
  );
}
