import type { User } from "@prisma/client";
import { useNavigate, useSubmit } from "@remix-run/react";
import { IoLogOutOutline } from "react-icons/io5";

type Props = {
  user: User | null;
};

const MenuFooter = ({ user }: Props) => {
  const navigate = useNavigate();
  const submit = useSubmit();

  return (
    <div className="absolute bottom-0 left-0 right-0 w-full px-0">
      <div className="flex flex-row items-center justify-between border-t border-white/25 px-3 py-4">
        {/* eslint-disable */}
        <label
          htmlFor="mobile-navigation-state"
          className="text-xs font-bold text-brand-white/75"
          onClick={() => navigate("terms-and-conditions")}
        >
          Terms & Conditions
        </label>

        {user && (
          <label
            htmlFor="mobile-navigation-state"
            onClick={() => submit(null, { method: "post", action: "/logout" })}
          >
            <IoLogOutOutline size={20} />
          </label>
        )}

        {!user && (
          <label
            htmlFor="mobile-navigation-state"
            className="flex items-center rounded-sm bg-primary px-3 py-2 text-sm tracking-wide text-brand-white"
            onClick={() => navigate("login")}
          >
            Login
          </label>
        )}

        {/* eslint-enable */}
      </div>
    </div>
  );
};

export default MenuFooter;
