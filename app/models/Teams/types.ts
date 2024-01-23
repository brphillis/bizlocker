import { Team } from "@prisma/client";
import { StaffWithDetails } from "../Staff/types";
import { StoreWithDetails } from "../Stores/types";

export interface TeamWithStaff extends Team {
  staff?: StaffWithDetails[] | null;
  store?: StoreWithDetails | null;
}

export type NewTeam = {
  id: string;
  name: string;
  store: string;
  isActive: boolean;
};
