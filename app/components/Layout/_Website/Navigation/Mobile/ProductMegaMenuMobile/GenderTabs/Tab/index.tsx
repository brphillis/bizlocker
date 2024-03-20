import { MegaMenuTypes } from "../../../../Desktop/ProductMegaMenu";

type Props = {
  gender: string;
  setSelectedTab: React.Dispatch<
    React.SetStateAction<MegaMenuTypes | undefined>
  >;
  selectedTab?: MegaMenuTypes;
};

const Tab = ({ setSelectedTab, gender, selectedTab }: Props) => {
  return (
    <button
      type="button"
      className={`px-3 relative text-center w-full font-semibold tracking-wide border-brand-white/10 border min-h-[50px] flex items-center justify-center 
      ${selectedTab == gender ? "!border-white/75" : ""}`}
      onClick={() =>
        selectedTab !== gender
          ? setSelectedTab(gender)
          : setSelectedTab(undefined)
      }
    >
      {gender}
    </button>
  );
};

export default Tab;
