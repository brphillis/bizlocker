import { useEffect, useState } from "react";
import { capitalizeFirst } from "~/helpers/stringHelpers";

type Props = {
  tabNames: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  dynamicTabNames?: boolean;
};

const BoxedTabs = (props: Props) => {
  const [activeTab, setActiveTab] = useState<string>(props.activeTab);

  useEffect(() => {
    props.onTabChange(activeTab);
  }, [activeTab, props]);

  useEffect(() => {
    if (props.dynamicTabNames) {
      setActiveTab(props.tabNames[0]);
    }
  }, [props.tabNames, props.dynamicTabNames]);

  return (
    <div
      id="BoxTabContainer"
      role="tablist"
      className="tabs-boxed tabs w-full rounded-none !p-0"
    >
      {props.tabNames?.map((tabName: string) => {
        return (
          <div
            key={"boxTab_" + tabName}
            role="tab"
            className={`tab !h-max !rounded-none bg-primary py-[6px] text-white ${
              activeTab === tabName ? "!bg-primary-dark" : ""
            }`}
            onClick={() => setActiveTab(tabName)}
          >
            {capitalizeFirst(tabName)}
          </div>
        );
      })}
    </div>
  );
};

export default BoxedTabs;
