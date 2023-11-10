import { Role, Color, OrderStatus, ApprovalStatus } from "@prisma/client";

export const getAvailableRoles = async () => {
  const availableRoles = Object.values(Role);

  availableRoles.sort((a, b) => a.localeCompare(b));

  return availableRoles;
};

export const getAvailableColors = async () => {
  const availableColors = Object.values(Color);

  availableColors.sort((a, b) => a.localeCompare(b));

  return availableColors;
};

export const getOrderStatusList = async () => {
  const statusList = Object.values(OrderStatus);

  statusList.sort((a, b) => a.localeCompare(b));

  return statusList;
};

export const getApprovalStatusList = async () => {
  const statusList = Object.values(ApprovalStatus);

  statusList.sort((a, b) => a.localeCompare(b));

  return statusList;
};
