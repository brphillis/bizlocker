import { Outlet } from "@remix-run/react";
import PageWrapper from "~/components/Layout/Wrappers/PageWrapper";
import AccountMenuMobile from "~/components/Menus/AccountMenuMobile";
import AccountMenuDesktop from "~/components/Menus/AccountMenuDesktop";

const Account = () => {
  return (
    <PageWrapper>
      <AccountMenuMobile />

      <div className="flex items-start justify-center gap-6 max-md:mt-3">
        <AccountMenuDesktop />
        <Outlet />
      </div>
    </PageWrapper>
  );
};

export default Account;
