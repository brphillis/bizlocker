import { IoSearchOutline } from "react-icons/io5";
import AccountButton from "../Buttons/AccountButton";
import CartButton from "../Buttons/CartButton";
import LoginButton from "~/components/Buttons/LoginButton";

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
  return (
    <div className="hidden items-center gap-6 lg:flex">
      {user && <AccountButton {...user} />}
      {cart && <CartButton {...cart} />}

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
