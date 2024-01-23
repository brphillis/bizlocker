import { useEffect, useState } from "react";
import { capitalizeFirst } from "~/helpers/stringHelpers";

//do not place spaces in tab names

type Props = {
  tabNames: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  dynamicTabNames?: boolean;
  extendStyle?: string;
};

const BoxedTabs = (props: Props) => {
  const [activeTab, setActiveTab] = useState<string>(props.activeTab);
  const [tabsWithErrors, setTabsWithErrors] = useState<string[]>();

  useEffect(() => {
    props.setActiveTab(activeTab);
  }, [activeTab, props]);

  useEffect(() => {
    if (props.dynamicTabNames) {
      setActiveTab(props.tabNames[0]);
    }

    const tabsToSet = [""];

    props?.tabNames.forEach((name) => {
      const tabContent = document?.querySelector(`[data-tabname=${name}]`);

      if (tabContent) {
        const errorElement = tabContent?.querySelector(".text-error.tooltip");

        if (errorElement) {
          tabsToSet.push(name);
        }
      }
    });

    setTabsWithErrors(tabsToSet);
  }, [props.tabNames, props.dynamicTabNames]);

  return (
    <div
      id="BoxTabContainer"
      role="tablist"
      className={`tabs-boxed tabs w-full rounded-none !p-0 ${props?.extendStyle}`}
    >
      {props.tabNames?.map((tabName: string) => {
        const containsError = tabsWithErrors?.find((e) => e === tabName);
        {
          /* eslint-disable */
        }
        return (
          <div
            key={"boxTab_" + tabName}
            id={"boxTab_" + tabName}
            role="tab"
            className={`tab !h-max !rounded-none bg-primary py-[6px] text-white 
            ${activeTab === tabName ? "!bg-primary-dark" : ""}
            ${activeTab === tabName && containsError ? "!bg-red-500" : ""}
            ${containsError ? "!bg-error" : ""}
            `}
            onClick={() => setActiveTab(tabName)}
          >
            {capitalizeFirst(tabName)}
          </div>
        );
        {
          /* eslint-enable */
        }
      })}
    </div>
  );
};

export default BoxedTabs;
