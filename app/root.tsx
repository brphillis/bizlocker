import {
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
  useLocation,
  useNavigate,
  useRouteError,
} from "@remix-run/react";

import BasicButton from "./components/Buttons/BasicButton";
import AuthContainer from "~/components/Layout/Containers/AuthContainer";
import AuthPageWrapper from "~/components/Layout/Wrappers/AuthPageWrapper";

import "./tailwind.css";
import { LoaderFunctionArgs } from "@remix-run/server-runtime";
import { websiteRootLoader } from "./modules/Website/_Root/index.server";
import WebsiteRoot from "./modules/Website/_Root";
import { adminRootLoader } from "./modules/Admin/_Root/index.server";
import AdminRoot from "./modules/Admin/_Root";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const path = url.pathname;
  const segments = path.split("/");
  const firstSegment = segments[1];

  switch (firstSegment) {
    case "admin": {
      return await adminRootLoader(request);
    }

    default: {
      return await websiteRootLoader(request);
    }
  }
};

export default function Root() {
  const location = useLocation();
  const firstSegment = location.pathname.split("/")[1];

  return (
    <html lang="en" className="h-full min-h-screen">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full min-h-screen">
        {firstSegment === "admin" ? <AdminRoot /> : <WebsiteRoot />}

        <ScrollRestoration />
        <LiveReload />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const response = useRouteError();
  const navigate = useNavigate();

  const errorCode = (response as HttpError).status;
  const message = (response as HttpError).statusText;

  return (
    <html lang="en" className="h-full min-h-screen">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full min-h-screen">
        <AuthPageWrapper>
          <AuthContainer>
            <div className="form-control w-full select-none items-center gap-6">
              <h1 className="text-4xl font-bold tracking-wide">
                {errorCode || "ERROR: 500"}
              </h1>
              <p>{message || "There has been an Error."}</p>
            </div>

            <div className="form-control mt-3 gap-3">
              <div className="my-2 w-full border-b-2 border-brand-white/10" />

              <BasicButton label="Back" onClick={() => navigate(-1)} />
            </div>
          </AuthContainer>
        </AuthPageWrapper>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
