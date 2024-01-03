import React from "react";
import type { StaffWithDetails } from "~/models/auth/staff.server";
import type { NotificationWithContent } from "~/models/notifications";
import { Outlet, useNavigate } from "@remix-run/react";
import { IoMenu } from "react-icons/io5";
import { adminNavBarRoutes } from "./routes";
import SidebarDropdown from "./SidebarDropdown";
import SidebarItem from "./SidebarItem";
import LoadingOverlay from "~/components/Layout/LoadingOverlay";
import SidebarFooter from "./SidebarFooter";
import { isEmptyObject } from "~/helpers/objectHelpers";

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
      <div className="drawer-content relative flex min-h-[calc(100vh-60px)] flex-col items-center justify-start overflow-x-hidden">
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

            <div className="scrollbar-hide max-h-[calc(100vh-212px)] overflow-y-auto">
              {adminNavBarRoutes.map(
                (
                  { name, icon, link, children }: NavigationRouteItem,
                  i: number
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
                          children={children}
                          isFirstDropdown={isFirstDropdown}
                        />
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
                }
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
