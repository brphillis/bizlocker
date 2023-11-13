import { useNavigate, useSubmit } from "@remix-run/react";
import { IoLogOutOutline } from "react-icons/io5";

type Props = {
  user?: User;
};

const MobileMenuFooter = ({ user }: Props) => {
  const navigate = useNavigate();
  const submit = useSubmit();

  return (
    <div className="absolute bottom-0 left-0 right-0 w-full px-0">
      <div className="flex flex-row items-center justify-between border-t border-white/25 px-3 py-4">
        <label
          htmlFor="my-drawer-3"
          className="text-xs font-bold text-brand-white/75"
          onClick={() => navigate("terms-conditions")}
        >
          Terms & Conditions
        </label>

        {user && (
          <label
            htmlFor="my-drawer-3"
            onClick={() => submit(null, { method: "post", action: "/logout" })}
          >
            <IoLogOutOutline size={20} />
          </label>
        )}

        {!user && (
          <label
            htmlFor="my-drawer-3"
            className="flex items-center rounded-sm bg-primary px-3 py-2 text-sm tracking-wide text-brand-white"
            onClick={() => navigate("login")}
          >
            Login
          </label>
        )}
      </div>
    </div>
  );
};

export default MobileMenuFooter;
