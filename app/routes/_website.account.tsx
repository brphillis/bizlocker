import { Outlet } from "@remix-run/react";
import { tokenAuth } from "~/auth.server";
import {
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import PageWrapper from "~/components/Layout/Wrappers/PageWrapper";
import AccountMenuMobile from "~/components/Menus/AccountMenuMobile";
import AccountMenuDesktop from "~/components/Menus/AccountMenuDesktop";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: "CLUTCH | Your Account" },
    {
      name: "CLUTCH | Your Account",
      content: "CLUTCH | Your Account",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const authenticated = await tokenAuth(request);
  if (!authenticated.valid) {
    return redirect("/login");
  }

  const url = new URL(request.url);
  const isAccountPage = url.pathname === "/account";

  if (isAccountPage) {
    return redirect("/account/profile");
  } else return null;
};

const Account = () => {
  return (
    <PageWrapper noTopPadding={true}>
      <AccountMenuMobile />

      <div className="mt-6 flex items-start justify-center gap-6 max-md:mt-3">
        <AccountMenuDesktop />
        <Outlet />
      </div>
    </PageWrapper>
  );
};

export default Account;
