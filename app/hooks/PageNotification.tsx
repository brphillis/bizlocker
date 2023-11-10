import { useEffect } from "react";
import { Toast } from "~/components/Notifications/Toast";

const useNotification = (notification: PageNotification) => {
  useEffect(() => {
    if (notification) {
      Toast(notification.type, 2500, notification.message);
    }
  }, [notification]);
};

export default useNotification;
