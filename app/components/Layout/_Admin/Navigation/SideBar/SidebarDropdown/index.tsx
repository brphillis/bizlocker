import { capitalizeFirst } from "~/helpers/stringHelpers";
import Icon from "~/components/Icon";
import React from "react";
import SidebarDropdownChild from "./SidebarDropdownChild";
import type * as IconsIO5 from "react-icons/io5";

interface SidebarDropdownProps extends NavigationRouteItem {
  isFirstDropdown?: boolean;
}

const SidebarDropdown = ({
  icon,
  name,
  children,
  isFirstDropdown,
}: SidebarDropdownProps) => {
  return (
    <details
      className={`collapse collapse-arrow relative rounded-none border border-x-0 border-brand-white/10 bg-brand-white/5 pb-1 open:pb-0 ${
        !isFirstDropdown && "border-t-0"
      }`}
    >
      <summary className="text-md collapse-title -mb-3 font-medium tracking-wide text-primary-content after:mt-[-4px] after:text-brand-white">
        <div className="flex items-center gap-3">
          <Icon iconName={icon as keyof typeof IconsIO5} size={18} />
          <p className="select-none transition duration-500 ease-in-out hover:scale-[1.03]">
            {capitalizeFirst(name)}
          </p>
        </div>
      </summary>

      <div className="collapse-content">
        <ul className="!px-3 !pt-1 text-white/75">
          {children?.map(
            ({ name: childName, link }: NavigationRouteItem, i: number) => {
              return (
                <React.Fragment key={"AdminNavigationChild_" + childName + i}>
                  <SidebarDropdownChild name={childName} link={link} />
                </React.Fragment>
              );
            }
          )}
        </ul>
      </div>
    </details>
  );
};

export default SidebarDropdown;
