import type { Cart, User } from "@prisma/client";
import { IoMenu, IoPersonOutline, IoSearchOutline } from "react-icons/io5";
import AccountButton from "../../Buttons/AccountButton";
import CartButton from "../../Buttons/CartButton";
import { useLocation, useNavigate } from "@remix-run/react";

type Props = {
  setSearchState: (state: boolean) => void;
  searchState: boolean | null;
  user?: User | null;
  cart?: Cart | null;
};

const HamburgerContainer = ({
  user,
  cart,
  setSearchState,
  searchState,
}: Props) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="max-xl:flex h-[60px] items-center hidden">
      {/* eslint-disable */}
      <label
        htmlFor="mobile-navigation-state"
        className="btn btn-square btn-ghost text-brand-white/50"
      >
        <IoMenu size={26} />
      </label>
      {/* eslint-enable */}
      <div className="absolute right-3 flex items-center gap-6">
        {user && !location.pathname.includes("/account") && (
          <AccountButton {...user} />
        )}

        {!user && (
          <IoPersonOutline
            size={24}
            onClick={() => navigate("/login")}
            className="cursor-pointer text-brand-white"
          />
        )}

        {cart && location.pathname !== "/cart" && <CartButton {...cart} />}

        <IoSearchOutline
          className="cursor-pointer text-brand-white"
          size={24}
          onClick={() => setSearchState(!searchState)}
        />
      </div>
    </div>
  );
};

export default HamburgerContainer;
