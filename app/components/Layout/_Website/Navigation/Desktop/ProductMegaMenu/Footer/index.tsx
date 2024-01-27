import { useNavigate } from "@remix-run/react";
import BasicButton from "~/components/Buttons/BasicButton";
import { MegaMenuTypes } from "..";

type Props = {
  activeMenu?: MegaMenuTypes;
};

const Footer = ({ activeMenu }: Props) => {
  const navigate = useNavigate();

  const returnQueryString = (arg: string): string => {
    let queryString = "";

    if (arg === "promo") {
      queryString = "/products?isPromoted=true";
    }
    if (arg === "sale") {
      queryString = "/products?onSale=true";
    }

    if (activeMenu === "sale") {
      return queryString;
    } else {
      queryString += `&gender=${activeMenu}`;
    }

    return queryString;
  };

  return (
    <div className="flex w-full justify-between px-12 items-center">
      <div className="flex gap-3">
        <BasicButton
          label="Promo Items"
          onClick={() => navigate(returnQueryString("promo"))}
        />

        <BasicButton
          label="On Sale"
          onClick={() => navigate(returnQueryString("sale"))}
        />
      </div>

      <h1 className="select-none text-center text-2xl font-bold tracking-wide text-white/90">
        CLUTCH.
      </h1>
    </div>
  );
};

export default Footer;
