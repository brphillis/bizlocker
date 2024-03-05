import type { User } from "@prisma/client";
import { useSubmit } from "@remix-run/react";
import { useRef } from "react";
import { IoClose, IoPersonOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import Divider from "~/components/Filter/ProductFilterSideBar/Divider";

const AccountButton = (user: User) => {
  const submit = useSubmit();
  const { email } = user;
  const accountModalRef = useRef<HTMLDivElement | null>(null);

  const handleOpen = () => {
    if (accountModalRef.current) {
      accountModalRef.current.focus();
    }
  };

  const handleClose = () => {
    if (accountModalRef.current) {
      accountModalRef.current.blur();
    }
  };

  return (
    <div className="dropdown dropdown-end relative">
      {/* eslint-disable */}
      <label
        tabIndex={1}
        onClick={handleOpen}
        className="relative cursor-pointer marker:h-20"
      >
        <IoPersonOutline size={24} className="text-brand-white" />
      </label>

      {/* ACCOUNT MODAL */}
      <div
        ref={accountModalRef}
        tabIndex={1}
        className="dropdown-content z-10 mr-2 mt-4 w-max min-w-[300px] overflow-hidden rounded-md border-2 border-base-200/75 bg-base-100 pb-3 shadow-xl"
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

        <Divider color="black" extendStyle="mb-4 mt-3" />

        <NavLink
          className="relative mx-3 mb-1 flex cursor-pointer items-center justify-center gap-3 rounded-sm border bg-brand-black border-brand-black/25 px-3 py-3 text-brand-white"
          to="/account/profile"
        >
          Account
        </NavLink>
        <NavLink
          className="relative mx-3 mb-1 flex cursor-pointer items-center justify-center gap-3 rounded-sm border bg-brand-black border-brand-black/25 px-3 py-3 text-brand-white"
          to="/account/orders"
        >
          Orders
        </NavLink>
        <NavLink
          className="relative mx-3 mb-1 flex cursor-pointer items-center justify-center gap-3 rounded-sm border bg-brand-black border-brand-black/25 px-3 py-3 text-brand-white"
          to="/account/wishlist"
        >
          Wishlist
        </NavLink>
        <div
          className="relative mx-3 mb-1 flex cursor-pointer items-center justify-center gap-3 rounded-sm border bg-brand-black border-brand-black/25 px-3 py-3 text-brand-white"
          onClick={() => submit(null, { method: "post", action: "/logout" })}
        >
          Logout
        </div>
      </div>
      {/* eslint-enable */}
    </div>
  );
};

export default AccountButton;
