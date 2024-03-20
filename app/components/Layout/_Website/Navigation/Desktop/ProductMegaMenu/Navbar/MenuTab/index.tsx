import { Link } from "@remix-run/react";
import { MegaMenuTypes } from "../..";

type Props = {
  tabName: MegaMenuTypes;
  setActiveMenu: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const MenuTab = ({ tabName, setActiveMenu }: Props) => {
  let url;

  switch (tabName) {
    case "Sale": {
      url = "/products?onSale=true";
      break;
    }

    default: {
      url = `/products?gender=${tabName}`;
      break;
    }
  }

  return (
    <Link
      className="text-brand-white cursor-pointer"
      onMouseEnter={() => {
        setActiveMenu(tabName);
      }}
      to={url}
    >
      {tabName.toUpperCase()}
    </Link>
  );
};

export default MenuTab;
