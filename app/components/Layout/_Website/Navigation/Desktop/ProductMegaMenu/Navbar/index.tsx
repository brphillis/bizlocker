import React from "react";
import ButtonContainer from "../../ButtonContainer";

import { Cart, User } from "@prisma/client";
import { megaMenuTabs, MegaMenuTypes } from "..";
import MenuTab from "./MenuTab";

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
          {megaMenuTabs?.map((tabName: MegaMenuTypes) => {
            return (
              <MenuTab
                key={"desktop_megaMenu_tab_" + tabName}
                tabName={tabName}
                setActiveMenu={setActiveMenu}
              />
            );
          })}
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
