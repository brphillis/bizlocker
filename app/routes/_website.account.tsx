import { Outlet } from "@remix-run/react";
import { type LoaderArgs, redirect } from "@remix-run/server-runtime";
import { tokenAuth } from "~/auth.server";
import PageWrapper from "~/components/Layout/_Website/PageWrapper";
import AccountMenuDesktop from "~/components/Menus/AccountMenuDesktop";
import AccountMenuMobile from "~/components/Menus/AccountMenuMobile";

export const loader = async ({ request }: LoaderArgs) => {
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
