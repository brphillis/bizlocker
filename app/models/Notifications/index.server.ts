import { prisma } from "../../db.server";
import { Notification } from "@prisma/client";
import { NotificationWithContent } from "./types";
export type { Brand } from "@prisma/client";

export const createStoreNotification = async (
  storeId: string,
  message: string,
): Promise<Notification> => {
  return await prisma.notification.create({
    data: {
      store: { connect: { id: Number(storeId) } },
      message,
    },
  });
};

export const getStoreNotifications = async (
  storeId: string,
): Promise<NotificationWithContent[] | null> => {
  return await prisma.notification.findMany({
    where: {
      storeId: parseInt(storeId),
    },
  });
};

export const getStaffNotifications = async (
  staffId: string,
): Promise<NotificationWithContent[] | null> => {
  return await prisma.notification.findMany({
    where: {
      staffId: parseInt(staffId),
    },
  });
};
