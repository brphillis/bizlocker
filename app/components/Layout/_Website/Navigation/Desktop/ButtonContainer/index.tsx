import type { Cart, User } from "@prisma/client";
import { useLocation, useNavigate } from "@remix-run/react";
import { IoPersonOutline, IoSearchOutline } from "react-icons/io5";
import CartButton from "../../Buttons/CartButton";
import AccountButton from "../../Buttons/AccountButton";

type Props = {
  user: User | null;
  cart: Cart | null;
  setSearchState: (state: boolean) => void;
  searchState: boolean | null;
};

const ButtonContainer = ({
  user,
  cart,
  setSearchState,
  searchState,
}: Props) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <div className="flex h-[60px] items-center gap-6 max-xl:hidden px-6 max-md:px-3">
        {user && !location.pathname.includes("/account") && (
          <AccountButton {...user} />
        )}
        {cart && location.pathname !== "/cart" && <CartButton {...cart} />}

        <IoSearchOutline
          size={24}
          onClick={() => setSearchState(!searchState)}
          className="cursor-pointer !text-brand-white"
        />

        {!user && (
          <IoPersonOutline
            size={24}
            onClick={() => navigate("/login")}
            className="cursor-pointer text-brand-white"
          />
        )}
      </div>
    </>
  );
};

export default ButtonContainer;
