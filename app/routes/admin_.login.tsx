import { json, type ActionFunctionArgs } from "@remix-run/node";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import { useEffect } from "react";
import { createStaffSession } from "~/session.server";
import { safeRedirect } from "~/helpers/navigateHelpers";
import AuthContainer from "~/components/Layout/AuthContainer";
import AuthPageWrapper from "~/components/Layout/AuthPageWrapper";
import { isValidEmail, isValidPassword } from "~/utility/validate";
import {
  Link,
  useActionData,
  useLocation,
  useNavigate,
} from "@remix-run/react";
import { verifyStaffLogin } from "~/models/auth/staffLogin";
import BasicButton from "~/components/Buttons/BasicButton";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/admin/home");
  const remember = formData.get("remember");

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

  try {
    const { staff } = await verifyStaffLogin(
      email as string,
      password as string
    );

    return createStaffSession({
      request,
      user: JSON.stringify(staff),
      remember: remember === "on" ? true : false,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof Error) {
      const validationErrors = [error.message];
      return json({ validationErrors });
    } else {
      throw new Response(null, {
        status: 500,
        statusText: "An Unexpected Error Has Occured",
      });
    }
  }
};

const AdminLogin = () => {
  const { user, validationErrors } =
    (useActionData() as ActionReturnTypes) || {};

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      navigate("/admin/home");
    }
  }, [user, navigate, location]);

  return (
    <AuthPageWrapper>
      <AuthContainer sloganText="Admin Portal">
        <div className="form-control relative">
          <label className="label">
            <span className="label-text text-brand-white">Email</span>
          </label>
          <input
            name="email"
            type="text"
            placeholder="email"
            className="input input-bordered text-brand-black/50 focus:text-brand-black"
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
          {validationErrors && (
            <div>
              {Object.values(validationErrors).map((error: string, i) => (
                <p
                  key={error + i}
                  className="mb-4 text-center text-xs text-red-500"
                >
                  {error}
                </p>
              ))}
            </div>
          )}
        </>

        <div className="form-control gap-3">
          <BasicButton label="Login" />

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
