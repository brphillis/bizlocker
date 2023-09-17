import { NavLink, useSubmit } from "@remix-run/react";
import { IoChevronForward } from "react-icons/io5";

const AccountMenuMobile = () => {
  const submit = useSubmit();
  return (
    <div id="AccountMenuMobile" className="w-full max-w-[520px]">
      <div className="collapse collapse-arrow hidden w-full rounded-none bg-brand-black max-md:grid">
        <input type="checkbox" />
        <div className="collapse-title text-center text-xl font-medium text-brand-white">
          Account
        </div>
        <div className="collapse-content">
          <ul className="menu w-full rounded-none text-brand-white">
            <NavLink
              to="/account/profile"
              className={({ isActive }) =>
                `my-1 flex items-center justify-between rounded-md p-3 hover:bg-brand-white/10 ${
                  isActive && "bg-brand-white/10 font-semibold"
                }`
              }
            >
              <div>Profile</div>
              <IoChevronForward />
            </NavLink>

            <NavLink
              to="/account/address"
              className={({ isActive }) =>
                `my-1 flex items-center justify-between rounded-md p-3 hover:bg-brand-white/10 ${
                  isActive && "bg-brand-white/10 font-semibold"
                }`
              }
            >
              <div>Address</div>
              <IoChevronForward />
            </NavLink>

            {/* <NavLink
              to="/account/security"
              className={({ isActive }) =>
                `my-1 flex items-center justify-between rounded-md p-3 hover:bg-brand-white/10 ${
                  isActive && "bg-brand-white/10 font-semibold"
                }`
              }
            >
              <div>Login & Security</div>
              <IoChevronForward />
            </NavLink> */}

            <NavLink
              to="/orders"
              className="my-1 flex items-center justify-between rounded-md p-3 hover:bg-brand-white/10"
            >
              <div>My Orders</div>
              <IoChevronForward />
            </NavLink>

            <div
              className="my-1 flex cursor-pointer items-center justify-start rounded-md p-3 hover:bg-brand-white/10"
              onClick={() =>
                submit(null, { method: "POST", action: "/logout" })
              }
            >
              <div>Log Out</div>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AccountMenuMobile;
