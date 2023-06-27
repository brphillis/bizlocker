import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";
import {
  Form,
  NavLink,
  useActionData,
  useLocation,
  useNavigate,
} from "@remix-run/react";
import { useEffect } from "react";
import { googleLogin, verifyLogin } from "~/models/login.server";
import { createUserSession } from "~/session.server";
import background from "../assets/images/banner-login.jpg";
import LoginGoogle from "~/components/auth/LoginGoogle";

export const action = async ({ request }: ActionArgs) => {
  const form = Object.fromEntries(await request.formData());

  switch (form._action) {
    case "login":
      const { email, password, remember } = form;

      const user = await verifyLogin(email as string, password as string);
      if (user) {
        return createUserSession({
          request,
          user: JSON.stringify(user),
          remember: remember === "on" ? true : false,
          redirectTo: "/",
        });
      } else return null;

    case "googleLogin":
      const { credential } = form;
      if (credential) {
        return await googleLogin(request, credential);
      }
  }
};

export const meta: V2_MetaFunction = () => [{ title: "Login" }];

export default function LoginPage() {
  const user = useActionData();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      if (location.pathname.includes("admin")) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate, location]);
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
        className="w-max-content form-control relative w-[24rem] max-w-[98vw] rounded-lg bg-base-300 p-8"
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
          <label className="label">
            <div className="link-hover label-text-alt link">
              Forgot password?
            </div>
          </label>
        </div>
        <div className="form-control mt-6 gap-3">
          <button
            type="submit"
            name="_action"
            value="login"
            className="btn-primary btn"
          >
            Login
          </button>
          <NavLink to="/register" type="button" className="btn-primary btn">
            Create Account
          </NavLink>
          <div className="divider !my-[0.1rem] w-full" />
          <LoginGoogle />
        </div>
      </Form>
    </div>
  );
}
