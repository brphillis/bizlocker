import { IoPersonOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";

const AccountButton = (user: User) => {
  const { email } = user;

  return (
    <div className="dropdown-end dropdown relative z-10">
      <label tabIndex={0} className="relative cursor-pointer marker:h-20">
        <IoPersonOutline size={24} className="text-brand-white" />
      </label>

      {/* ACCOUNT MENU */}
      <div
        tabIndex={0}
        className="dropdown-content mr-3 mt-3 w-max min-w-[300px] overflow-hidden rounded-none border border-white/20 bg-base-100 py-3 shadow"
      >
        <ul className="mb-3 text-center">
          <div className="font-bold">Welcome</div>
          <div>{email}</div>
        </ul>

        <NavLink
          className="relative mb-1 flex w-full flex-col items-center justify-center gap-1 bg-base-300/50 px-3 py-3"
          to="/account"
        >
          Account
        </NavLink>
        <NavLink
          className="relative mb-1 flex w-full flex-col items-center justify-center gap-1 bg-base-300/50 px-3 py-3"
          to="/orders"
        >
          Orders
        </NavLink>
      </div>
      {/* ACCOUNT MENU */}
    </div>
  );
};

export default AccountButton;
