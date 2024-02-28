import React from "react";
import ButtonContainer from "../../ButtonContainer";
import { MegaMenuTypes } from "..";
import { Cart, User } from "@prisma/client";
import { Link } from "@remix-run/react";

type Props = {
  cart: Cart | null;
  searchState: boolean | null;
  setActiveMenu: React.Dispatch<
    React.SetStateAction<MegaMenuTypes | undefined>
  >;
  setSearchState: React.Dispatch<React.SetStateAction<boolean | null>>;
  user: User | null;
};

const Navbar = ({
  cart,
  searchState,
  setActiveMenu,
  setSearchState,
  user,
}: Props) => {
  return (
    <div className="flex flex-col w-full max-xl:hidden">
      <div className="flex items-center w-full">
        <div className="flex items-center w-full h-full gap-12 ml-12 font-bold">
          <Link
            className="text-brand-white cursor-pointer"
            onMouseEnter={() => {
              setActiveMenu("mens");
            }}
            to="/products?gender=MALE"
          >
            MENS
          </Link>
          <Link
            className="text-brand-white cursor-pointer"
            onMouseEnter={() => setActiveMenu("womans")}
            to="/products?gender=FEMALE"
          >
            WOMANS
          </Link>
          <Link
            className="text-brand-white cursor-pointer"
            onMouseEnter={() => setActiveMenu("kids")}
            to="/products?gender=KIDS"
          >
            KIDS
          </Link>
          <Link
            className="text-brand-white cursor-pointer"
            onMouseEnter={() => setActiveMenu("sale")}
            to="/products?onSale=true"
          >
            SALE
          </Link>
        </div>

        <ButtonContainer
          cart={cart}
          searchState={searchState}
          setSearchState={setSearchState}
          user={user}
        />
      </div>
    </div>
  );
};

export default Navbar;
