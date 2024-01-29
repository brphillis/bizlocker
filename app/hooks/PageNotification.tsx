import { useEffect } from "react";
import { Toast, type ToastType } from "~/components/Notifications/Toast";

export type PageNotification = {
  message: string;
  type: ToastType;
};

const useNotification = (notification?: PageNotification) => {
  useEffect(() => {
    if (notification) {
      Toast(notification.type, 2500, notification.message);
    }
  }, [notification]);
};

export default useNotification;
