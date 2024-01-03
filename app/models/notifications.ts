import { prisma } from "~/db.server";
import type { Notification } from "@prisma/client";
import type { UserWithDetails } from "./auth/users.server";
import type { StaffWithDetails } from "./auth/staff.server";
import type { StoreWithDetails } from "./stores.server";
export type { Brand } from "@prisma/client";

export interface NotificationWithContent extends Notification {
  user?: UserWithDetails[] | null;
  staff?: StaffWithDetails | null;
  store?: StoreWithDetails[] | null;
}

export const createStoreNotification = async (
  storeId: string,
  message: string
): Promise<Notification> => {
  return await prisma.notification.create({
    data: {
      store: { connect: { id: Number(storeId) } },
      message,
    },
  });
};

export const getStoreNotifications = async (
  storeId: number | null
): Promise<NotificationWithContent[] | null> => {
  return await prisma.notification.findMany({
    where: {
      storeId,
    },
  });
};

export const getStaffNotifications = async (
  staffId: string | null
): Promise<NotificationWithContent[] | null> => {
  return await prisma.notification.findMany({
    where: {
      staffId,
    },
  });
};
