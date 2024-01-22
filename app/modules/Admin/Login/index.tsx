import { useEffect } from "react";
import BasicButton from "~/components/Buttons/BasicButton";
import BasicInput from "~/components/Forms/Input/BasicInput";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import AuthContainer from "~/components/Layout/Containers/AuthContainer";
import AuthPageWrapper from "~/components/Layout/Wrappers/AuthPageWrapper";
import { Link, useActionData, useSubmit } from "@remix-run/react";
import ValidationErrorsList from "~/components/Forms/Validation/ValidationErrorsList";

const AdminLogin = () => {
  const { user, validationErrors } =
    (useActionData() as ActionReturnTypes) || {};

  const submit = useSubmit();

  useEffect(() => {
    if (user) {
      submit(null, { method: "post", action: "/logout" });
    }
  }, [user]);

  return (
    <AuthPageWrapper>
      <AuthContainer sloganText="Admin Portal">
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
          to="/password-recovery"
          className="link-hover link mb-3 ml-1 mt-2 cursor-pointer text-xs text-brand-white/75"
        >
          Forgot password?
        </Link>

        <ValidationErrorsList validationErrors={validationErrors} />

        <div className="form-control gap-3 pt-3">
          <BasicButton label="Login" type="submit" />

          <div className="my-2 w-full border-b-2 border-brand-white/10" />
          <p className="select-none text-center text-xs">
            Powered by BizLocker v0.1
          </p>
        </div>
      </AuthContainer>
    </AuthPageWrapper>
  );
};

export default AdminLogin;
