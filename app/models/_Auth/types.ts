export interface StaffSession {
  id: number | null;
  storeId: number | null;
  role: Role;
  email: string;
  isActive: boolean;
}

export interface UserLoginResponse {
  id: number;
  email: string;
}
