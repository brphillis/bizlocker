import { StaffWithDetails } from "~/models/Staff/types";
import { json, type MetaFunction } from "@remix-run/node";
import { getUserDataFromSession, STAFF_SESSION_KEY } from "~/session.server";
import {
  getStaffNotifications,
  getStoreNotifications,
} from "~/models/Notifications/index.server";

export const meta: MetaFunction = () => {
  return [
    { title: "CLUTCH | Admin Portal" },
    {
      name: "CLUTCH | Admin Portal",
      content: "CLUTCH | Admin Portal",
    },
  ];
};

export const adminRootLoader = async (request: Request) => {
  const staffMember = (await getUserDataFromSession(
    request,
    STAFF_SESSION_KEY,
  )) as StaffWithDetails;

  const userNotifications = [];

  const storeNotifications =
    staffMember?.storeId &&
    (await getStoreNotifications(staffMember?.storeId?.toString()));

  if (storeNotifications) {
    userNotifications.push(...storeNotifications);
  }

  const staffNotifications = await getStaffNotifications(
    staffMember?.id.toString(),
  );

  if (staffNotifications) {
    userNotifications.push(...staffNotifications);
  }

  return json({ staffMember, userNotifications });
};
