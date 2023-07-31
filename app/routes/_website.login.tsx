import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { Form, NavLink, useActionData } from "@remix-run/react";
import { googleLogin, verifyLogin } from "~/models/auth/login.server";
import { createUserSession } from "~/session.server";
import background from "../assets/banners/banner-login.jpg";
import LoginGoogle from "~/components/auth/LoginGoogle";
import { isValidEmail, isValidPassword } from "~/utility/validate";

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
    <div className="relative flex h-full min-h-[calc(100vh-64px)] w-full items-center justify-center">
      <div
        style={{
          backgroundImage: `url(${background})`,
        }}
        className="absolute top-0 z-0 h-full w-full bg-cover brightness-75"
      />
      <Form
        method="POST"
        className="w-max-content form-control relative w-[24rem] max-w-[98vw] rounded-lg bg-brand-black p-8 text-brand-white"
      >
        <h1 className="select-none pb-6 pt-3 text-center text-6xl font-bold tracking-wide text-white/90">
          CLUTCH.
        </h1>
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
          <label className="label">
            <div className="link-hover link label-text-alt text-brand-white/75">
              Forgot password?
            </div>
          </label>
        </div>

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

        <div className="form-control mt-3 gap-3">
          <button
            type="submit"
            name="_action"
            value="login"
            className="btn btn-primary"
          >
            Login
          </button>
          <NavLink to="/register" type="button" className="btn btn-primary">
            Create Account
          </NavLink>
          <div className="my-2 w-full border-b-2 border-brand-white/10" />
          <LoginGoogle />
        </div>
      </Form>
    </div>
  );
}
