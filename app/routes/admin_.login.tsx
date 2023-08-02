import type { ActionArgs } from "@remix-run/node";
import {
  Form,
  NavLink,
  useActionData,
  useLocation,
  useNavigate,
} from "@remix-run/react";
import { useEffect } from "react";
import { verifyLogin } from "~/models/auth/login.server";
import { createUserSession } from "~/session.server";
import { safeRedirect } from "~/utils";
import AuthPageWrapper from "~/components/Layout/AuthPageWrapper";

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/admin");
  const remember = formData.get("remember");

  const user = await verifyLogin(email as string, password as string);
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
  const user = useActionData();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      navigate("/admin");
    }
  }, [user, navigate, location]);

  return (
    <AuthPageWrapper>
      <Form
        method="POST"
        className="w-max-content form-control relative w-[24rem] max-w-[98vw] rounded-lg bg-brand-black p-8 text-brand-white"
      >
        <div className="flex flex-col items-center">
          <h1 className="select-none pb-6 pt-3 text-center text-6xl font-bold tracking-wide text-white/90">
            CLUTCH.
          </h1>
          <p className="mt-[-20px] select-none text-xs">Admin Login</p>
        </div>
        {/* <img src={image} className="mb-1 mt-1 h-[80px] select-none p-2" /> */}
        <div className="form-control">
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
            className="input input-bordered text-brand-black/50 focus:text-brand-black"
          />
          <label className="label">
            <div className="link-hover link label-text-alt">
              Forgot password?
            </div>
          </label>
        </div>

        <div className="form-control gap-3">
          <button type="submit" className="btn btn-primary">
            Login
          </button>
          <NavLink to="/register" type="button" className="btn btn-primary">
            Create Account
          </NavLink>
          <div className="my-2 w-full border-b-2 border-brand-white/10" />
          <p className="select-none text-center text-xs">
            Powered by BizLocker v0.1
          </p>
        </div>
      </Form>
    </AuthPageWrapper>
  );
};

export default AdminLogin;
