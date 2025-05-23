import { NavLink, useSubmit } from "@remix-run/react";
import { IoChevronForward, IoLogOutOutline } from "react-icons/io5";

const AccountMenuMobile = () => {
  const submit = useSubmit();
  return (
    <div id="AccountMenuMobile" className="-m-[1px] w-full max-w-[520px] -mt-3">
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
              to="/account/orders"
              className={({ isActive }) =>
                `my-1 flex items-center justify-between rounded-md p-3 hover:bg-brand-white/10 ${
                  isActive && "bg-brand-white/10 font-semibold"
                }`
              }
            >
              <div>My Orders</div>
              <IoChevronForward />
            </NavLink>

            <button
              type="button"
              className="my-1 flex cursor-pointer items-center justify-between rounded-md p-3 hover:bg-brand-white/10"
              onClick={() =>
                submit(null, { method: "POST", action: "/logout" })
              }
            >
              <div>Log Out</div>
              <IoLogOutOutline size={16} />
            </button>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AccountMenuMobile;
