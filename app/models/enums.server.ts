import { Role, Color } from "@prisma/client";

export const getAvailableRoles = async () => {
  const availableRoles = Object.values(Role);

  // Sort the colors alphabetically
  availableRoles.sort((a, b) => a.localeCompare(b));

  return availableRoles;
};

export const getAvailableColors = async () => {
  const availableColors = Object.values(Color);

  // Sort the colors alphabetically
  availableColors.sort((a, b) => a.localeCompare(b));

  return availableColors;
};
