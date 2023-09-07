import { IoSearchOutline } from "react-icons/io5";
import AccountButton from "../Buttons/AccountButton";
import CartButton from "../Buttons/CartButton";
import LoginButton from "~/components/Buttons/LoginButton";
import { useLocation } from "@remix-run/react";

type Props = {
  user: User;
  cart: Cart;
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
    <div className="hidden h-[60px] items-center gap-6 lg:flex">
      {user && <AccountButton {...user} />}
      {cart && location.pathname !== "/cart" && <CartButton {...cart} />}

      <IoSearchOutline
        size={24}
        onClick={() => setSearchState(!searchState)}
        className="cursor-pointer !text-brand-white"
      />

      {!user && <LoginButton />}
    </div>
  );
};

export default DesktopButtonContainer;
