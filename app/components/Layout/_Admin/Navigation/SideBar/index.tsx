import React from "react";
import { IoMenu } from "react-icons/io5";
import { Outlet, useNavigate } from "@remix-run/react";
import { isEmptyObject } from "~/helpers/objectHelpers";
import { StaffWithDetails } from "~/models/Staff/types";
import { NotificationWithContent } from "~/models/Notifications/types";
import LoadingOverlay from "~/components/Layout/Overlays/LoadingOverlay";
import SidebarItem from "./SidebarItem";
import SidebarFooter from "./SidebarFooter";
import { adminNavBarRoutes } from "./routes";
import SidebarDropdown from "./SidebarDropdown";

type Props = {
  staffMember: StaffWithDetails | null;
  userNotifications: NotificationWithContent[] | null;
};

const AdminSideBar = ({ staffMember, userNotifications }: Props) => {
  const navigate = useNavigate();

  return (
    <div
      data-theme="light-theme"
      className="drawer min-h-screen lg:drawer-open"
    >
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content relative flex min-h-[calc(100dvh-60px)] flex-col items-center justify-start overflow-x-hidden">
        {/* eslint-disable */}
        <div className="flex h-[60px] w-full flex-row items-center gap-6 self-start justify-self-start bg-brand-black px-1 py-3 lg:hidden">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-square btn-ghost text-brand-white/50"
          >
            <IoMenu size={26} />
          </label>

          <h1
            className="select-none text-center text-2xl font-bold tracking-wide text-white/90"
            onClick={() => navigate("/admin/home")}
          >
            CLUTCH.
          </h1>
        </div>
        <LoadingOverlay />

        <Outlet />
      </div>

      {staffMember && !isEmptyObject(staffMember) && (
        <div className="drawer-side z-50 min-h-screen">
          <label
            htmlFor="my-drawer-2"
            className="drawer-overlay !min-h-screen"
          />
          <ul className="scrollbar-hide menu h-max min-h-full w-80 overflow-y-scroll bg-brand-black px-0 py-4 text-brand-white">
            <h1 className="select-none pt-3 text-center text-2xl font-bold tracking-wide text-white/90">
              CLUTCH.
            </h1>
            <p className="pt-3 text-center text-[12px]">
              Welcome, {staffMember?.email}
            </p>
            <div className="divider w-full" />
            {/* eslint-enable */}
            <div className="scrollbar-hide max-h-[calc(100vh-212px)] overflow-y-auto">
              {adminNavBarRoutes.map(
                (
                  { name, icon, link, children }: NavigationRouteItem,
                  i: number,
                ) => {
                  const isFirstDropdown =
                    children &&
                    i === adminNavBarRoutes.findIndex((item) => item.children);
                  if (children) {
                    return (
                      <React.Fragment
                        key={"AdminNavigationDropdown_" + name + i}
                      >
                        <SidebarDropdown
                          icon={icon}
                          name={name}
                          isFirstDropdown={isFirstDropdown}
                        >
                          {children}
                        </SidebarDropdown>
                      </React.Fragment>
                    );
                  } else {
                    return (
                      <React.Fragment
                        key={"AdminNavigationStandardItem_" + name + i}
                      >
                        <SidebarItem icon={icon} name={name} link={link} />
                      </React.Fragment>
                    );
                  }
                },
              )}
            </div>

            <SidebarFooter
              staffMember={staffMember as StaffWithDetails}
              userNotifications={userNotifications}
            />
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminSideBar;
