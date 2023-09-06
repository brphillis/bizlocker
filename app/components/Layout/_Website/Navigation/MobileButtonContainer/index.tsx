import { IoMenu, IoSearchOutline } from "react-icons/io5";
import AccountButton from "../Buttons/AccountButton";
import CartButton from "../Buttons/CartButton";

type Props = {
  user: User;
  cart: Cart;
  setSearchState: (state: boolean) => void;
  searchState: boolean | null;
};

const MobileButtonContainer = ({
  user,
  cart,
  setSearchState,
  searchState,
}: Props) => {
  return (
    <div className="flex items-center lg:hidden">
      <label
        htmlFor="my-drawer-3"
        className="btn btn-square btn-ghost text-brand-white/50"
      >
        <IoMenu size={26} />
      </label>

      <div className="absolute right-3 flex gap-6">
        {user && <AccountButton {...user} />}
        {cart && <CartButton {...cart} />}

        <IoSearchOutline
          className="cursor-pointer text-brand-white"
          size={24}
          onClick={() => setSearchState(!searchState)}
        />
      </div>
    </div>
  );
};

export default MobileButtonContainer;
