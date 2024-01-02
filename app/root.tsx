import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
  useRouteError,
} from "@remix-run/react";

import stylesheet from "~/tailwind.css";

import BasicButton from "./components/Buttons/BasicButton";
import AuthContainer from "~/components/Layout/AuthContainer";
import AuthPageWrapper from "~/components/Layout/AuthPageWrapper";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export default function Root() {
  return (
    <html lang="en" className="h-full min-h-screen">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full min-h-screen">
        <Outlet />
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
  console.log("RESPONSE", response);
  const errorCode = (response as any).status;
  const message = (response as any).statusText;

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
