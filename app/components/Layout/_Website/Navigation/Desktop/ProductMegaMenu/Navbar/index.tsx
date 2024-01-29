import React from "react";
import ButtonContainer from "../../ButtonContainer";
import { MegaMenuTypes } from "..";
import { Cart, User } from "@prisma/client";

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
          <div
            className="text-brand-white cursor-pointer"
            onMouseEnter={() => {
              setActiveMenu("mens");
            }}
          >
            MENS
          </div>
          <div
            className="text-brand-white cursor-pointer"
            onMouseEnter={() => setActiveMenu("womans")}
          >
            WOMANS
          </div>
          <div
            className="text-brand-white cursor-pointer"
            onMouseEnter={() => setActiveMenu("kids")}
          >
            KIDS
          </div>
          <div
            className="text-brand-white cursor-pointer"
            onMouseEnter={() => setActiveMenu("sale")}
          >
            SALE
          </div>
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
