import { useSubmit } from "@remix-run/react";
import { IoClose, IoPersonOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";

const AccountButton = (user: User) => {
  const submit = useSubmit();
  const { email } = user;

  const handleOpen = () => {
    const elementWithTabIndex1 = document.getElementById("AccountContent");
    if (elementWithTabIndex1) {
      elementWithTabIndex1.style.display = "block";
    }
  };

  const handleClose = () => {
    const elementWithTabIndex1 = document.getElementById("AccountContent");
    if (elementWithTabIndex1) {
      elementWithTabIndex1.style.display = "none";
    }
  };

  return (
    <div className="dropdown-end dropdown relative z-10">
      <label
        tabIndex={1}
        onClick={handleOpen}
        className="relative cursor-pointer marker:h-20"
      >
        <IoPersonOutline size={24} className="text-brand-white" />
      </label>

      {/* ACCOUNT MODAL */}
      <div
        id="AccountContent"
        tabIndex={1}
        className="dropdown-content mr-2 mt-4 w-max min-w-[300px] overflow-hidden rounded-md border-2 border-base-200/75 bg-base-100 pb-3 shadow-xl"
      >
        <IoClose
          onClick={handleClose}
          className="
          absolute right-2 top-2
          cursor-pointer
          rounded-full bg-primary p-[0.2rem] text-white"
        />

        <ul className="my-3 text-center">
          <div className="font-bold">Welcome</div>
          <div>{email}</div>
        </ul>

        <NavLink
          className="relative mx-3 mb-1 flex cursor-pointer flex-col items-center justify-center gap-1 border border-base-300 bg-base-200/50 px-3 py-3 text-brand-black"
          to="/account"
        >
          Account
        </NavLink>
        <NavLink
          className="relative mx-3 mb-1 flex cursor-pointer flex-col items-center justify-center gap-1 border border-base-300 bg-base-200/50 px-3 py-3 text-brand-black"
          to="/orders"
        >
          Orders
        </NavLink>
        <div
          className="relative mx-3 mb-1 flex cursor-pointer flex-col items-center justify-center gap-1 border border-base-300 bg-base-200/50 px-3 py-3 text-brand-black"
          onClick={() => submit(null, { method: "post", action: "/logout" })}
        >
          Logout
        </div>
      </div>
      {/* ACCOUNT MENU */}
    </div>
  );
};

export default AccountButton;
