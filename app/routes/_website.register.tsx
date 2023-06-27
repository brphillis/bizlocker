import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";
import {
  Form,
  NavLink,
  useActionData,
  useLocation,
  useNavigate,
} from "@remix-run/react";
import { useEffect } from "react";
import background from "../assets/images/banner-login.jpg";
import { registerUser } from "~/models/register.server";
import { isValidEmail, isValidPassword } from "~/utility/validate";

export const action = async ({ request }: ActionArgs) => {
  const form = Object.fromEntries(await request.formData());
  const { email, password, confirmPassword } = form;

  if (password !== confirmPassword) {
    const validationError = "Passwords Do Not Match";
    return { validationError };
  }

  if (!isValidEmail(email as string)) {
    const validationError = "Invalid Email Address";
    return { validationError };
  }

  if (!isValidPassword(password as string)) {
    const validationError = "Password Does Not Meet Requirements";
    return { validationError };
  }

  try {
    return await registerUser(email as string, password as string);
  } catch (error: any) {
    const validationError = error.message;
    return { validationError };
  }
};

export const meta: V2_MetaFunction = () => [{ title: "Register" }];

export default function LoginPage() {
  const { user, validationError } =
    (useActionData() as { user: User; validationError: string }) || {};
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      navigate("/");
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
        className="w-max-content form-control relative w-[24rem] max-w-[98vw] gap-3 rounded-lg bg-base-300 p-8"
      >
        <h1 className="select-none pb-6 pt-3 text-center text-6xl font-bold tracking-wide text-white/90">
          CLUTCH.
        </h1>
        {/* <img src={image} className="mb-1 mt-1 h-[80px] select-none p-2" /> */}
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
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Confirm Password</span>
          </label>
          <input
            name="confirmPassword"
            type="password"
            placeholder="confirm password"
            className="input-bordered input"
          />
        </div>

        {validationError && (
          <p className="my-2 text-center text-sm text-red-500/75">
            {validationError}
          </p>
        )}

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
        <div className="form-control mt-3">
          <p className="pb-6 text-[10px] opacity-75">
            By subscribing and / or creating an account you agree to CLUTCH
            Terms and Conditions, and Privacy Policy.
          </p>
          <button type="submit" className="btn-primary btn mb-3">
            Register
          </button>
          <NavLink to="/login" type="button" className="btn-primary btn">
            Back
          </NavLink>
        </div>
      </Form>
    </div>
  );
}
