import { useNavigate } from "@remix-run/react";
import BasicImage from "~/components/Client/BasicImage";
import { MegaMenuTypes } from "../../../Desktop/ProductMegaMenu";

type Props = {
  name: string;
  imageSrc?: string | null;
  selectedTab?: MegaMenuTypes;
};

const CategoryCard = ({ name, imageSrc, selectedTab }: Props) => {
  const navigate = useNavigate();

  return (
    <button
      className="shadow-[0_18px_10px_-15px_rgba(0,0,0,0.5)] border-brand-white/10 border w-full min-h-[75px] overflow-hidden"
      onClick={() => {
        let query = `?productCategory=${name}`;

        if (selectedTab) {
          query += `&gender=${selectedTab}`;
        }

        navigate({
          pathname: "/products",
          search: query,
        });
      }}
    >
      <label
        htmlFor="mobile-navigation-state"
        className="w-full h-full relative flex items-center"
      >
        <div className="w-full pl-6 -mr-6 text-left">{name.toUpperCase()}</div>

        {imageSrc && (
          <BasicImage
            alt={"mobileMenu_categoryCard_" + name}
            extendStyle="hover:scale-[1.01] h-[75px] w-[100px] duration-300 cursor-pointer"
            src={imageSrc}
          />
        )}
      </label>
    </button>
  );
};

export default CategoryCard;
