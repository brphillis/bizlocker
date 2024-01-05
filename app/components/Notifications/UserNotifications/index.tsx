import type { NotificationWithContent } from "~/models/notifications.server";
import { IoNotificationsOff, IoNotificationsOutline } from "react-icons/io5";
import React from "react";
import NotificationCard from "./NotificationCard";
import BasicModal from "~/components/Modal/BasicModal";

type Props = {
  userNotifications: NotificationWithContent[] | null;
};

const UserNotifications = ({ userNotifications }: Props) => {
  return (
    <>
      <BasicModal
        modalKey="userNotifications"
        title="Notifications"
        button={
          <>
            <div className="relative">
              <IoNotificationsOutline size={22} />
            </div>
            {userNotifications && userNotifications.length > 0 && (
              <span className="absolute right-[-6px] top-[-6px] flex h-4 w-4 items-center justify-center rounded-full bg-brand-red p-2 text-[10px] text-brand-white">
                {userNotifications.length}
              </span>
            )}
          </>
        }
        body={
          <>
            <div className="flex w-full flex-col items-center gap-3 px-6 pt-6">
              {userNotifications
                ?.reverse()
                ?.map((notification: NotificationWithContent, i: number) => {
                  return (
                    <React.Fragment key={"UserNotification" + i}>
                      <NotificationCard notification={notification} />
                    </React.Fragment>
                  );
                })}
              {!userNotifications ||
                (userNotifications && userNotifications.length === 0 && (
                  <div className="flex select-none items-center gap-3 p-3 pb-0 text-center opacity-50">
                    <IoNotificationsOff size={20} />
                    <p>No Notifications.</p>
                  </div>
                ))}
            </div>
          </>
        }
      />
    </>
  );
};

export default UserNotifications;
