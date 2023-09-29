import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { NavLink, useActionData, useNavigate } from "@remix-run/react";
import { registerUser } from "~/models/auth/register.server";
import { isValidEmail, isValidPassword } from "~/utility/validate";
import { useEffect } from "react";
import { ActionAlert } from "~/components/Notifications/Alerts";
import AuthPageWrapper from "~/components/Layout/AuthPageWrapper";
import AuthContainer from "~/components/Layout/AuthContainer";

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
    const { success } = await registerUser(email as string, password as string);
    return { success };
  } catch (error: any) {
    const validationError = [error.message];
    return { validationError };
  }
};

export const meta: V2_MetaFunction = () => [{ title: "Register" }];

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { validationError, success } =
    (useActionData() as { validationError: string[]; success: boolean }) || {};

  useEffect(() => {
    const successPopup = () => {
      ActionAlert(
        "Registration Complete",
        "We Have Sent You a Verification Email.",
        () => navigate("/login")
      );
    };

    if (success) {
      successPopup();
    }
  }, [success, navigate]);

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
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text text-brand-white">
              Confirm Password
            </span>
          </label>
          <input
            name="confirmPassword"
            type="password"
            placeholder="confirm password"
            className="input input-bordered mb-3 bg-base-100 text-brand-black/50 focus:text-brand-black"
          />
        </div>
        <>
          {validationError?.length > 0 &&
            validationError?.map((error: string, i) => {
              return (
                <p
                  key={error + i}
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
        </>
        <div className="form-control mt-6">
          <p className="pb-6 text-[10px] opacity-75">
            By subscribing and / or creating an account you agree to CLUTCH
            Terms and Conditions, and Privacy Policy.
          </p>
          <button type="submit" className="btn btn-primary mb-3 !rounded-sm">
            Register
          </button>
          <NavLink
            to="/login"
            type="button"
            className="btn btn-primary !rounded-sm"
          >
            Back
          </NavLink>
        </div>
      </AuthContainer>
    </AuthPageWrapper>
  );
};

export default RegisterPage;
