import type { ActionArgs } from "@remix-run/node";
import {
  Link,
  useActionData,
  useLocation,
  useNavigate,
} from "@remix-run/react";
import { useEffect } from "react";
import { verifyLogin } from "~/models/auth/login.server";
import { createUserSession } from "~/session.server";
import { safeRedirect } from "~/utils";
import AuthPageWrapper from "~/components/Layout/AuthPageWrapper";
import { isValidEmail, isValidPassword } from "~/utility/validate";
import AuthContainer from "~/components/Layout/AuthContainer";

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/admin");
  const remember = formData.get("remember");
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
      redirectTo,
    });
  } else return null;
};

const AdminLogin = () => {
  const { user, validationError } =
    (useActionData() as { validationError: string[]; user: Object }) || {};

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
          {validationError?.length > 0 && (
            <div>
              {validationError.map((error: string, i) => {
                return (
                  <p
                    key={error + i}
                    className="mb-4 text-center text-xs text-red-500"
                  >
                    {error}
                  </p>
                );
              })}
            </div>
          )}
        </>

        <div className="form-control gap-3">
          <button type="submit" className="btn btn-primary">
            Login
          </button>
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
