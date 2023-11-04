import { NavLink, useSubmit } from "@remix-run/react";
import { IoChevronForward, IoLogOutOutline } from "react-icons/io5";

const AccountMenuDesktop = () => {
  const submit = useSubmit();

  return (
    <div id="AccountMenuDesktop" className="block max-md:hidden">
      <div className="pb-3 pl-1 text-xl font-bold">Account</div>
      <ul className="menu w-72 rounded-none bg-base-200">
        <NavLink
          to="/account/profile"
          className={({ isActive }) =>
            `my-1 flex items-center justify-between rounded-sm p-3 hover:bg-base-300 ${
              isActive && "bg-base-300 font-semibold"
            }`
          }
        >
          <div>Profile</div>
          <IoChevronForward />
        </NavLink>

        <NavLink
          to="/account/address"
          className={({ isActive }) =>
            `my-1 flex items-center justify-between rounded-sm p-3 hover:bg-base-300 ${
              isActive && "bg-base-300 font-semibold"
            }`
          }
        >
          <div>Address</div>
          <IoChevronForward />
        </NavLink>

        <NavLink
          to="/account/orders"
          className={({ isActive }) =>
            `my-1 flex items-center justify-between rounded-sm p-3 hover:bg-base-300 ${
              isActive && "bg-base-300 font-semibold"
            }`
          }
        >
          <div>My Orders</div>
          <IoChevronForward />
        </NavLink>

        <div
          className="my-1 flex cursor-pointer items-center justify-between rounded-sm p-3 hover:bg-base-300"
          onClick={() => submit(null, { method: "post", action: "/logout" })}
        >
          <div>Log Out</div>
          <IoLogOutOutline size={16} />
        </div>
      </ul>
    </div>
  );
};

export default AccountMenuDesktop;
