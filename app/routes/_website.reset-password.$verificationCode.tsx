import { useEffect } from "react";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import { isValidPassword } from "~/utility/validate";
import { json, type ActionArgs } from "@remix-run/node";
import AuthContainer from "~/components/Layout/AuthContainer";
import { ActionAlert } from "~/components/Notifications/Alerts";
import AuthPageWrapper from "~/components/Layout/AuthPageWrapper";
import { resetUserPassword } from "~/models/auth/register.server";
import { verifyPasswordReset } from "~/models/auth/verification.server";
import {
  Link,
  useActionData,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";

export const loader = async ({ params, request }: ActionArgs) => {
  const url = new URL(request.url);
  const verificationCode = params.verificationCode;
  const emailAddress = url.searchParams.get("email");

  if (emailAddress && verificationCode) {
    const { success: verified, email } = await verifyPasswordReset(
      emailAddress,
      verificationCode,
      false
    );
    return json({ verified, email });
  } else return false;
};

export const action = async ({ request, params }: ActionArgs) => {
  const url = new URL(request.url);
  const verificationCode = params.verificationCode;
  const emailAddress = url.searchParams.get("email");

  const form = Object.fromEntries(await request.formData());

  const { password, confirmPassword } = form;
  let validationErrors: string[] = [];

  if (password !== confirmPassword) {
    validationErrors.push("Passwords Do Not Match");
  }

  if (!isValidPassword(password as string)) {
    validationErrors.push("Password Does Not Meet Requirements");
  }

  if (validationErrors.length > 0) {
    return { validationErrors };
  }

  try {
    if (emailAddress && verificationCode) {
      const { success, email } = await verifyPasswordReset(
        emailAddress,
        verificationCode,
        true
      );

      if (success && email) {
        await resetUserPassword(email, password as string);
        return { success: true };
      } else {
        const validationErrors = ["Not Authorized."];
        return { validationErrors };
      }
    } else {
      const validationErrors = ["Not Authorized."];
      return { validationErrors };
    }
  } catch (error: any) {
    const validationErrors = [error.message];
    return { validationErrors };
  }
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const verified = useLoaderData();
  const { validationErrors, success } = useActionData() as ActionReturnTypes;

  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    const successPopup = () => {
      ActionAlert("Reset Complete", "Your Password has been Reset.", () =>
        navigate("/login")
      );
    };

    if (success) {
      successPopup();
    }
  }, [success, navigate]);

  return (
    <>
      {verified && (
        <AuthPageWrapper>
          <AuthContainer>
            <p className="mb-3 select-none text-center text-xs">
              Reset Password
            </p>
            <p className="mb-3 select-none text-center text-sm">{email}</p>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-brand-white">
                  New Password
                </span>
              </label>
              <input
                name="password"
                type="password"
                placeholder="new password"
                className="input input-bordered bg-base-100 text-brand-black/50 focus:text-brand-black"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-brand-white">
                  Confirm New Password
                </span>
              </label>
              <input
                name="confirmPassword"
                type="password"
                placeholder="confirm new password"
                className="input input-bordered mb-3 bg-base-100 text-brand-black/50 focus:text-brand-black"
              />
            </div>

            <>
              {Object.values(validationErrors)?.map((error: string, i) => (
                <p
                  key={error + i}
                  className="mt-1 text-center text-xs text-red-500/75"
                >
                  {error}
                </p>
              ))}

              {Object.values(validationErrors)?.includes(
                "Password" && "Requirements"
              ) && (
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
            <div className="form-control mt-3">
              <p className="pb-6 text-[10px] opacity-75">
                By subscribing and / or creating an account you agree to CLUTCH
                Terms and Conditions, and Privacy Policy.
              </p>
              <button type="submit" className="btn btn-primary mb-3">
                Register
              </button>

              <Link to="/login" type="button" className="btn btn-primary">
                Back
              </Link>
            </div>
          </AuthContainer>
        </AuthPageWrapper>
      )}
    </>
  );
};

export default ResetPassword;
