import { Role, OrderStatus, ApprovalStatus } from "@prisma/client";

export const getAvailableRoles = async (): Promise<Role[]> => {
  const availableRoles = Object.values(Role);

  availableRoles.sort((a, b) => a.localeCompare(b));

  return availableRoles;
};

export const getOrderStatusList = async (): Promise<OrderStatus[]> => {
  const statusList = Object.values(OrderStatus);

  statusList.sort((a, b) => a.localeCompare(b));

  return statusList;
};

export const getApprovalStatusList = async (): Promise<ApprovalStatus[]> => {
  const statusList = Object.values(ApprovalStatus);

  statusList.sort((a, b) => a.localeCompare(b));

  return statusList;
};
