import LoginGoogle from "~/components/Auth/LoginGoogle";
import BasicButton from "~/components/Buttons/BasicButton";
import BasicInput from "~/components/Forms/Input/BasicInput";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import { Link, useActionData, useNavigate } from "@remix-run/react";
import AuthContainer from "~/components/Layout/Containers/AuthContainer";
import AuthPageWrapper from "~/components/Layout/Wrappers/AuthPageWrapper";
import ValidationErrorsList from "~/components/Forms/Validation/ValidationErrorsList";

export const Login = () => {
  const { validationErrors } = (useActionData() as ActionReturnTypes) || {};

  const navigate = useNavigate();

  return (
    <AuthPageWrapper>
      <AuthContainer>
        <BasicInput
          name="email"
          type="text"
          label="Email"
          extendContainerStyle="w-full"
          extendStyle="input input-bordered bg-base-100 text-brand-black/50 focus:text-brand-black"
          labelStyle="text-brand-white"
          placeholder="Email"
        />

        <BasicInput
          name="password"
          type="password"
          label="Password"
          extendContainerStyle="w-full"
          extendStyle="input input-bordered bg-base-100 text-brand-black/50 focus:text-brand-black"
          labelStyle="text-brand-white"
          placeholder="Password"
        />

        <Link
          to="/password-recovery/request"
          className="link-hover link mb-3 ml-1 mt-2 cursor-pointer text-xs text-brand-white/75"
        >
          Forgot password?
        </Link>

        <>
          <ValidationErrorsList validationErrors={validationErrors} />

          {validationErrors && validationErrors?.verified && (
            <Link
              to="/verify/request"
              className="pt-3 link-hover link mb-2 cursor-pointer text-center text-xs text-brand-white/75"
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
};

export default Login;
