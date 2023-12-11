import type { Cart, User } from "@prisma/client";
import { useLocation } from "@remix-run/react";
import { IoSearchOutline } from "react-icons/io5";
import LoginButton from "~/components/Buttons/LoginButton";
import CartButton from "../Buttons/CartButton";
import AccountButton from "../Buttons/AccountButton";

type Props = {
  user: User | null;
  cart: Cart | null;
  setSearchState: (state: boolean) => void;
  searchState: boolean | null;
};

const DesktopButtonContainer = ({
  user,
  cart,
  setSearchState,
  searchState,
}: Props) => {
  const location = useLocation();

  return (
    <>
      <div className="grow"></div>
      <div className="hidden h-[60px] items-center gap-6 lg:flex">
        {user && !location.pathname.includes("/account") && (
          <AccountButton {...user} />
        )}
        {cart && location.pathname !== "/cart" && <CartButton {...cart} />}

        <IoSearchOutline
          size={24}
          onClick={() => setSearchState(!searchState)}
          className="cursor-pointer !text-brand-white"
        />

        {!user && <LoginButton />}
      </div>
    </>
  );
};

export default DesktopButtonContainer;
