import {
  IoNotificationsOutline,
  IoPersonOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import LogoutButton from "~/components/Buttons/LogoutButton";
import { type StaffWithDetails } from "~/models/auth/staff.server";

const SidebarFooter = (user: StaffWithDetails) => {
  return (
    <div className="border-t-1 absolute bottom-0 flex w-full items-center justify-between border-t border-t-brand-white/10 bg-brand-white/5 p-3">
      <div className="flex items-center gap-6">
        <div className="cursor-pointer text-brand-white/50 hover:text-brand-white">
          <IoSettingsOutline size={22} />
        </div>

        <div className="cursor-pointer text-brand-white/50 hover:text-brand-white">
          <IoPersonOutline size={22} />
        </div>

        <div className="cursor-pointer text-brand-white/50 hover:text-brand-white">
          <IoNotificationsOutline size={22} />
        </div>
      </div>
      {user && <LogoutButton />}
    </div>
  );
};

export default SidebarFooter;
