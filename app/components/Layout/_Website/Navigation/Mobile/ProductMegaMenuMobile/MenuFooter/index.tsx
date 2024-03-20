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
    <>
      <div className="w-full px-0">
        <div className="flex flex-row items-center justify-between py-4">
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
              onClick={() =>
                submit(null, { method: "post", action: "/logout" })
              }
            >
              <IoLogOutOutline size={20} />
            </label>
          )}

          {!user && (
            <label
              htmlFor="mobile-navigation-state"
              className="flex items-center rounded-sm bg-primary px-6 py-3 text-sm tracking-wide text-brand-white"
              onClick={() => navigate("login")}
            >
              LOGIN
            </label>
          )}

          {/* eslint-enable */}
        </div>
      </div>
    </>
  );
};

export default MenuFooter;
