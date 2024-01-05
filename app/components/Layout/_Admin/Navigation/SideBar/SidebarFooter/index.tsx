import { type StaffWithDetails } from "~/models/staff.server";
import { type NotificationWithContent } from "~/models/notifications.server";
import { IoPersonOutline, IoSettingsOutline } from "react-icons/io5";
import LogoutButton from "~/components/Buttons/LogoutButton";
import UserNotifications from "~/components/Notifications/UserNotifications";

type Props = {
  staffMember: StaffWithDetails | null;
  userNotifications: NotificationWithContent[] | null;
};

const SidebarFooter = ({ staffMember, userNotifications }: Props) => {
  return (
    <div className="border-t-1 absolute bottom-0 flex w-full items-center justify-between border-t border-t-brand-white/10 bg-brand-white/5 p-3">
      <div className="flex items-center gap-6">
        <div className="cursor-pointer text-brand-white/50 hover:text-brand-white">
          <IoSettingsOutline size={22} />
        </div>

        <div className="cursor-pointer text-brand-white/50 hover:text-brand-white">
          <IoPersonOutline size={22} />
        </div>

        <UserNotifications userNotifications={userNotifications} />
      </div>
      {staffMember && <LogoutButton />}
    </div>
  );
};

export default SidebarFooter;
