import { MegaMenuTypes } from "../../../Desktop/ProductMegaMenu";
import Tab from "./Tab";

type Props = {
  setSelectedTab: React.Dispatch<
    React.SetStateAction<MegaMenuTypes | undefined>
  >;
  selectedTab?: MegaMenuTypes;
};

const GenderTabs = ({ setSelectedTab, selectedTab }: Props) => {
  return (
    <div className="relative flex items-center gap-1 py-1 w-full justify-center">
      <Tab
        gender="Mens"
        setSelectedTab={setSelectedTab}
        selectedTab={selectedTab}
      />
      <Tab
        gender="Womans"
        setSelectedTab={setSelectedTab}
        selectedTab={selectedTab}
      />
      <Tab
        gender="Kids"
        setSelectedTab={setSelectedTab}
        selectedTab={selectedTab}
      />
      <Tab
        gender="Sale"
        setSelectedTab={setSelectedTab}
        selectedTab={selectedTab}
      />
    </div>
  );
};

export default GenderTabs;
