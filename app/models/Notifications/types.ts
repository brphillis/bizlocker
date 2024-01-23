import { Notification } from "@prisma/client";
import { UserWithDetails } from "../Users/types";
import { StaffWithDetails } from "../Staff/types";
import { StoreWithDetails } from "../Stores/types";

export interface NotificationWithContent extends Notification {
  user?: UserWithDetails | null;
  staff?: StaffWithDetails | null;
  store?: StoreWithDetails | null;
}
